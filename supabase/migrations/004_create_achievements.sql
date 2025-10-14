-- Migration: 创建成就系统表
-- Created: 2024
-- Description: 创建achievements和user_achievements表

-- 创建成就稀有度枚举
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- 创建achievements表
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
  rarity achievement_rarity DEFAULT 'common',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_achievements_code ON public.achievements(code);
CREATE INDEX idx_achievements_rarity ON public.achievements(rarity);

-- 启用RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看成就
CREATE POLICY "Anyone can view achievements"
  ON public.achievements
  FOR SELECT
  USING (true);

-- 创建user_achievements表
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 创建索引
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked_at ON public.user_achievements(unlocked_at DESC);

-- 启用RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS策略:所有人可以查看用户成就
CREATE POLICY "Anyone can view user achievements"
  ON public.user_achievements
  FOR SELECT
  USING (true);

-- RLS策略:系统自动创建用户成就(通过服务端)
CREATE POLICY "Service role can insert achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (true);

-- 创建触发器函数:解锁成就时奖励XP
CREATE OR REPLACE FUNCTION award_achievement_xp()
RETURNS TRIGGER AS $$
DECLARE
  achievement_xp INTEGER;
BEGIN
  -- 获取成就的XP奖励
  SELECT xp_reward INTO achievement_xp
  FROM public.achievements
  WHERE id = NEW.achievement_id;
  
  -- 更新用户XP
  UPDATE public.users
  SET xp = xp + achievement_xp
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 添加触发器
CREATE TRIGGER award_achievement_xp_trigger
  AFTER INSERT ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION award_achievement_xp();

-- 插入初始成就数据
INSERT INTO public.achievements (code, title, description, icon, xp_reward, rarity) VALUES
  ('hello_world', 'Hello World', '首次成功运行代码', '🎉', 10, 'common'),
  ('first_lesson', '新手上路', '完成第一个课程关卡', '📚', 10, 'common'),
  ('first_project', '创作之星', '创建第一个作品', '⭐', 20, 'common'),
  ('complete_level_1', 'HTML5 新手', '完成 Level 1 所有关卡', '🏆', 50, 'rare'),
  ('complete_level_2', '样式设计师', '完成 Level 2 所有关卡', '🎨', 50, 'rare'),
  ('complete_level_3', 'JS 学徒', '完成 Level 3 所有关卡', '⚡', 50, 'rare'),
  ('complete_level_4', '交互工程师', '完成 Level 4 所有关卡', '🔧', 50, 'rare'),
  ('complete_level_5', '实战高手', '完成 Level 5 所有项目', '🚀', 100, 'epic'),
  ('perfect_score', '完美主义者', '获得一次满分评价', '💯', 30, 'rare'),
  ('speed_demon', '速度之王', '5分钟内完成一个关卡', '⏱️', 30, 'rare'),
  ('no_errors', '零错大师', '一次性通过关卡,无任何错误', '✅', 30, 'rare'),
  ('helpful', '乐于助人', '帮助他人(点赞或评论10次)', '🤝', 20, 'common'),
  ('popular', '人气之星', '作品获得100个点赞', '🌟', 50, 'epic'),
  ('community_star', '社区明星', '作品获得1000个点赞', '💫', 150, 'legendary'),
  ('week_streak', '坚持不懈', '连续7天登录学习', '🔥', 30, 'rare'),
  ('month_streak', '持之以恒', '连续30天登录学习', '💪', 100, 'epic'),
  ('year_streak', '学习传奇', '连续365天登录学习', '👑', 500, 'legendary'),
  ('boss_killer', 'Boss 杀手', '连续击败3次 AI Boss', '⚔️', 80, 'epic'),
  ('graduate', '编程毕业生', '完成所有 Level 1-5 课程', '🎓', 200, 'legendary'),
  ('legend', '网页高手', '达到 Lv10 最高等级', '🏅', 500, 'legendary')
ON CONFLICT (code) DO NOTHING;

-- 注释
COMMENT ON TABLE public.achievements IS '成就表';
COMMENT ON TABLE public.user_achievements IS '用户成就解锁记录表';
COMMENT ON COLUMN public.achievements.code IS '成就唯一标识码';
COMMENT ON COLUMN public.achievements.rarity IS '成就稀有度';

