-- Migration: 创建课程和关卡表
-- Created: 2024
-- Description: 创建courses, lessons, user_progress表及相关RLS策略

-- 创建课程难度枚举
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- 创建关卡状态枚举  
CREATE TYPE lesson_status AS ENUM ('locked', 'in_progress', 'completed');

-- 创建courses表
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  "order" INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_order ON public.courses("order");
CREATE INDEX idx_courses_published ON public.courses(is_published);

-- 启用RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看已发布的课程
CREATE POLICY "Anyone can view published courses"
  ON public.courses
  FOR SELECT
  USING (is_published = true OR auth.uid() = created_by);

-- RLS策略:教师可以创建课程
CREATE POLICY "Teachers can create courses"
  ON public.courses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('teacher', 'admin')
    )
  );

-- RLS策略:教师可以更新自己创建的课程
CREATE POLICY "Teachers can update own courses"
  ON public.courses
  FOR UPDATE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 创建lessons表
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  "order" INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 10 CHECK (xp_reward >= 0),
  coin_reward INTEGER DEFAULT 5 CHECK (coin_reward >= 0),
  difficulty difficulty_level DEFAULT 'easy',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons("order");
CREATE INDEX idx_lessons_difficulty ON public.lessons(difficulty);

-- 启用RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看已发布课程的关卡
CREATE POLICY "Anyone can view lessons of published courses"
  ON public.lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND is_published = true
    )
  );

-- 创建user_progress表
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status lesson_status DEFAULT 'locked',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 创建索引
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX idx_user_progress_status ON public.user_progress(status);

-- 启用RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS策略:用户只能查看和更新自己的进度
CREATE POLICY "Users can view own progress"
  ON public.user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 添加触发器
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 注释
COMMENT ON TABLE public.courses IS '课程表';
COMMENT ON TABLE public.lessons IS '课程关卡表';
COMMENT ON TABLE public.user_progress IS '用户学习进度表';

