-- =============================================
-- 社区功能扩展Migration
-- =============================================

-- 1. 添加用户书签表(收藏功能)
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    UNIQUE(user_id, project_id)
);

-- 索引
CREATE INDEX idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_project_id ON public.user_bookmarks(project_id);

-- RLS策略
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
    ON public.user_bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
    ON public.user_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
    ON public.user_bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- 2. 添加projects表的新字段
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- 3. 创建增加浏览量的RPC函数
CREATE OR REPLACE FUNCTION public.increment_view_count(project_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.projects
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = project_id;
END;
$$;

-- 4. 添加评论点赞表(可选)
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    UNIQUE(user_id, comment_id)
);

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- RLS策略
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment likes"
    ON public.comment_likes FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can like comments"
    ON public.comment_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
    ON public.comment_likes FOR DELETE
    USING (auth.uid() = user_id);

-- 5. 添加举报功能表
CREATE TYPE public.report_type AS ENUM (
    'spam',
    'inappropriate',
    'plagiarism',
    'other'
);

CREATE TYPE public.report_status AS ENUM (
    'pending',
    'reviewing',
    'resolved',
    'rejected'
);

CREATE TABLE IF NOT EXISTS public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reported_project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    reported_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
    type public.report_type NOT NULL,
    reason text NOT NULL,
    status public.report_status DEFAULT 'pending'::public.report_status NOT NULL,
    reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at timestamp with time zone,
    resolution_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    CONSTRAINT report_target_check CHECK (
        (reported_project_id IS NOT NULL AND reported_comment_id IS NULL) OR
        (reported_project_id IS NULL AND reported_comment_id IS NOT NULL)
    )
);

CREATE INDEX idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX idx_reports_status ON public.reports(status);

-- RLS策略
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
    ON public.reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

CREATE POLICY "Admins can update reports"
    ON public.reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'teacher')
        )
    );

