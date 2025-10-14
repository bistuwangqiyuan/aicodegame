# Supabase数据库Migration指南

## 概述

本目录包含GameCode Lab项目的所有Supabase数据库迁移文件。这些SQL脚本定义了完整的数据库架构、RLS策略和触发器。

## Migration文件列表

1. **001_create_users_table.sql** - 用户表和认证系统
2. **002_create_courses_and_lessons.sql** - 课程和关卡系统
3. **003_create_projects_and_community.sql** - 作品和社区功能
4. **004_create_achievements.sql** - 成就系统和初始数据

## 执行Migration

### 方法1: 通过Supabase Dashboard

1. 登录到 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 按顺序复制并执行每个migration文件内容
5. 验证表创建成功: 进入 **Table Editor** 查看

### 方法2: 通过Supabase CLI

```bash
# 1. 安装Supabase CLI
npm install -g supabase

# 2. 登录Supabase
supabase login

# 3. 链接到你的项目
supabase link --project-ref your-project-ref

# 4. 执行所有migrations
supabase db push

# 5. 生成TypeScript类型
npm run supabase:types
```

### 方法3: 通过Cursor MCP工具

如果MCP配置正确,可以使用:

```typescript
// 在Cursor中使用MCP Supabase工具
await mcp_supabase_apply_migration({
  name: 'create_users_table',
  query: '...' // migration内容
})
```

## 数据库架构

### 核心表

#### users
- **用途**: 存储用户扩展信息(关联auth.users)
- **关键字段**: level, xp, coins, role, trial期限
- **RLS**: 用户可查看所有,只能更新自己

#### courses
- **用途**: 存储课程信息(Level 1-5)
- **关键字段**: level, order, is_published
- **RLS**: 所有人可查看已发布,教师可创建/编辑

#### lessons
- **用途**: 存储课程关卡内容
- **关键字段**: content(JSONB), xp_reward, coin_reward, difficulty
- **RLS**: 跟随课程的发布状态

#### user_progress
- **用途**: 跟踪用户学习进度
- **关键字段**: status, score, attempts
- **RLS**: 用户只能查看/更新自己的进度

#### projects
- **用途**: 存储用户创建的作品
- **关键字段**: html_code, css_code, js_code, is_public, likes_count
- **RLS**: 公开作品所有人可见,私有仅作者可见

#### achievements
- **用途**: 定义可解锁的成就
- **关键字段**: code(唯一标识), rarity, xp_reward
- **RLS**: 所有人可查看

#### user_achievements
- **用途**: 记录用户已解锁的成就
- **自动触发**: 解锁时自动奖励XP
- **RLS**: 所有人可查看,服务端可插入

### 辅助表

- **project_likes**: 作品点赞记录
- **comments**: 作品评论

## 触发器和函数

### 自动触发器

1. **update_updated_at_column()** - 所有表的updated_at自动更新
2. **handle_new_user()** - 新用户注册时自动创建users记录
3. **update_project_likes_count()** - 点赞/取消点赞时更新计数
4. **award_achievement_xp()** - 解锁成就时奖励XP

### RLS策略

所有表均启用Row Level Security(RLS),确保数据安全:

- ✅ 用户只能访问自己的私有数据
- ✅ 公开数据所有人可见
- ✅ 教师/管理员有额外权限
- ✅ 游客有限制访问

## 初始数据

**achievements表**已预填充20个成就:

- 基础成就: Hello World, 新手上路, 创作之星
- 学习成就: 完成Level 1-5课程
- 挑战成就: 完美主义者, 速度之王, 零错大师
- 社交成就: 乐于助人, 人气之星, 社区明星
- 坚持成就: 连续7天/30天/365天学习
- 特殊成就: Boss杀手, 编程毕业生, 网页高手

## 验证安装

执行以下SQL验证数据库设置成功:

```sql
-- 检查表是否创建
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 检查RLS是否启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- 检查成就数据
SELECT COUNT(*) FROM public.achievements;
-- 应返回: 20

-- 检查触发器
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

## 故障排除

### 问题1: Migration执行失败

**错误**: `relation "public.users" already exists`

**解决**: 表已存在,先删除或跳过该migration

```sql
DROP TABLE IF EXISTS public.users CASCADE;
```

### 问题2: RLS策略冲突

**错误**: `policy "..." already exists`

**解决**: 先删除现有策略

```sql
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
```

### 问题3: 触发器函数不存在

**错误**: `function update_updated_at_column() does not exist`

**解决**: 确保按顺序执行migration,001必须最先执行

## 回滚Migration

如需完全重置数据库:

```sql
-- 警告: 此操作将删除所有数据!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

然后重新执行所有migration。

## 后续维护

### 添加新Migration

1. 在`migrations/`目录创建新文件: `00X_description.sql`
2. 编写SQL DDL语句
3. 测试migration在开发环境
4. 提交到版本控制
5. 部署到生产环境

### 修改现有表

⚠️ **重要**: 不要直接修改已有的migration文件!

应该创建新的migration文件来修改表结构:

```sql
-- 示例: 005_add_column_to_users.sql
ALTER TABLE public.users 
ADD COLUMN new_field TEXT;
```

## 相关文档

- [Supabase文档](https://supabase.com/docs)
- [PostgreSQL文档](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [数据库函数和触发器](https://supabase.com/docs/guides/database/functions)

## 联系支持

如果遇到数据库问题:

1. 查看 [GitHub Issues](https://github.com/yourusername/aicodegame/issues)
2. 联系开发团队
3. 查阅Supabase官方支持

