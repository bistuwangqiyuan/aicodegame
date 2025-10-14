-- Migration: 创建作品和社区相关表
-- Created: 2024
-- Description: 创建projects, project_likes, comments表

-- 创建projects表
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  html_code TEXT DEFAULT '',
  css_code TEXT DEFAULT '',
  js_code TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_is_public ON public.projects(is_public);
CREATE INDEX idx_projects_likes_count ON public.projects(likes_count DESC);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- 启用RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看公开作品
CREATE POLICY "Anyone can view public projects"
  ON public.projects
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- RLS策略:用户可以创建自己的作品
CREATE POLICY "Users can create own projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS策略:用户可以更新自己的作品
CREATE POLICY "Users can update own projects"
  ON public.projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS策略:用户可以删除自己的作品
CREATE POLICY "Users can delete own projects"
  ON public.projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建project_likes表
CREATE TABLE IF NOT EXISTS public.project_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- 创建索引
CREATE INDEX idx_project_likes_user_id ON public.project_likes(user_id);
CREATE INDEX idx_project_likes_project_id ON public.project_likes(project_id);

-- 启用RLS
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看点赞
CREATE POLICY "Anyone can view likes"
  ON public.project_likes
  FOR SELECT
  USING (true);

-- RLS策略:用户可以添加点赞
CREATE POLICY "Users can add likes"
  ON public.project_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS策略:用户可以取消自己的点赞
CREATE POLICY "Users can remove own likes"
  ON public.project_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建comments表
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_project_id ON public.comments(project_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- 启用RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看评论
CREATE POLICY "Anyone can view comments"
  ON public.comments
  FOR SELECT
  USING (true);

-- RLS策略:用户可以添加评论
CREATE POLICY "Users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS策略:用户可以更新自己的评论
CREATE POLICY "Users can update own comments"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS策略:用户可以删除自己的评论
CREATE POLICY "Users can delete own comments"
  ON public.comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建触发器函数:点赞时更新项目的点赞计数
CREATE OR REPLACE FUNCTION update_project_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects
    SET likes_count = likes_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects
    SET likes_count = likes_count - 1
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 添加触发器
CREATE TRIGGER update_project_likes_count_trigger
  AFTER INSERT OR DELETE ON public.project_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_project_likes_count();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE public.projects IS '用户作品表';
COMMENT ON TABLE public.project_likes IS '作品点赞表';
COMMENT ON TABLE public.comments IS '作品评论表';

