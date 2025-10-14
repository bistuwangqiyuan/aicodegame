-- Migration: 创建用户表
-- Created: 2024
-- Description: 创建users表及相关触发器和RLS策略

-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('guest', 'student', 'teacher', 'admin');

-- 创建users表(扩展auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_level ON public.users(level);

-- 启用RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS策略:用户可以查看所有用户信息
CREATE POLICY "Users can view all user profiles"
  ON public.users
  FOR SELECT
  USING (true);

-- RLS策略:用户只能更新自己的信息
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- 创建触发器函数:自动更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 添加触发器
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建触发器函数:新用户注册时自动创建users记录
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 注释
COMMENT ON TABLE public.users IS '用户扩展信息表';
COMMENT ON COLUMN public.users.username IS '用户名(唯一)';
COMMENT ON COLUMN public.users.display_name IS '显示名称';
COMMENT ON COLUMN public.users.avatar_url IS '头像URL';
COMMENT ON COLUMN public.users.role IS '用户角色';
COMMENT ON COLUMN public.users.level IS '用户等级(1-10)';
COMMENT ON COLUMN public.users.xp IS '经验值';
COMMENT ON COLUMN public.users.coins IS '金币数量';
COMMENT ON COLUMN public.users.trial_started_at IS '试用开始时间';
COMMENT ON COLUMN public.users.trial_expires_at IS '试用到期时间';

