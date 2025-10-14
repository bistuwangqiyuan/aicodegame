# GameCode Lab 数据库架构文档

## 数据库设计概览

GameCode Lab使用Supabase (PostgreSQL) 作为数据库,采用关系型数据库设计,包含用户系统、课程系统、社区系统和游戏化系统四大模块。

## ER图 (Entity-Relationship)

```
auth.users (Supabase内置)
    ↓ (1:1)
users ←→ (1:N) → user_progress ←→ (N:1) → lessons ←→ (N:1) → courses
  ↓ (1:N)             ↓ (N:N)
projects        achievements ←→ user_achievements
  ↓ (1:N)
project_likes / comments
```

## 表结构详解

### 1. users (用户扩展表)

**描述**: 扩展Supabase auth.users,存储游戏化数据

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK, FK→auth.users | 用户ID |
| username | TEXT | UNIQUE | 用户名 |
| display_name | TEXT | - | 显示名称 |
| avatar_url | TEXT | - | 头像URL |
| role | ENUM | DEFAULT 'student' | 角色(guest/student/teacher/admin) |
| level | INTEGER | 1-10 | 当前等级 |
| xp | INTEGER | ≥0 | 经验值 |
| coins | INTEGER | ≥0 | 金币数量 |
| trial_started_at | TIMESTAMP | NULLABLE | 试用开始时间 |
| trial_expires_at | TIMESTAMP | NULLABLE | 试用到期时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_users_username` ON username
- `idx_users_role` ON role
- `idx_users_level` ON level

**RLS策略**:
- SELECT: 所有人可查看
- UPDATE: 只能更新自己的记录

---

### 2. courses (课程表)

**描述**: 存储5个Level的课程信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 课程ID |
| title | TEXT | NOT NULL | 课程标题 |
| description | TEXT | NOT NULL | 课程描述 |
| level | INTEGER | 1-5 | 课程等级 |
| order | INTEGER | - | 排序顺序 |
| is_published | BOOLEAN | DEFAULT false | 是否已发布 |
| created_by | UUID | FK→users | 创建者ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_courses_level` ON level
- `idx_courses_order` ON order
- `idx_courses_published` ON is_published

**RLS策略**:
- SELECT: 已发布的所有人可见,未发布仅创建者可见
- INSERT: 教师/管理员可创建
- UPDATE: 创建者或管理员可更新

---

### 3. lessons (课程关卡表)

**描述**: 存储每个课程的具体关卡内容

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 关卡ID |
| course_id | UUID | FK→courses | 所属课程 |
| title | TEXT | NOT NULL | 关卡标题 |
| description | TEXT | NOT NULL | 关卡描述 |
| content | JSONB | NOT NULL | 关卡内容(JSON格式) |
| order | INTEGER | - | 排序顺序 |
| xp_reward | INTEGER | ≥0, DEFAULT 10 | XP奖励 |
| coin_reward | INTEGER | ≥0, DEFAULT 5 | 金币奖励 |
| difficulty | ENUM | easy/medium/hard | 难度等级 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**content字段JSON结构示例**:
```json
{
  "type": "coding", // coding | quiz | project
  "instructions": "创建一个包含标题的HTML页面",
  "starter_code": {
    "html": "<!DOCTYPE html>\n<html>\n</html>",
    "css": "",
    "js": ""
  },
  "solution": {
    "html": "...",
    "css": "...",
    "js": "..."
  },
  "validation_rules": [
    {
      "type": "contains_tag",
      "tag": "h1",
      "message": "需要包含<h1>标签"
    }
  ],
  "hints": [
    "提示1: <h1>标签用于定义最大的标题",
    "提示2: 可以在<body>中添加标题"
  ]
}
```

**索引**:
- `idx_lessons_course_id` ON course_id
- `idx_lessons_order` ON order
- `idx_lessons_difficulty` ON difficulty

**RLS策略**:
- SELECT: 跟随课程的is_published状态

---

### 4. user_progress (学习进度表)

**描述**: 跟踪用户每个关卡的学习进度

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 进度记录ID |
| user_id | UUID | FK→users | 用户ID |
| lesson_id | UUID | FK→lessons | 关卡ID |
| status | ENUM | locked/in_progress/completed | 状态 |
| score | INTEGER | 0-100, NULLABLE | 得分 |
| completed_at | TIMESTAMP | NULLABLE | 完成时间 |
| attempts | INTEGER | ≥0, DEFAULT 0 | 尝试次数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**约束**:
- UNIQUE(user_id, lesson_id) - 每个用户每个关卡只有一条记录

**索引**:
- `idx_user_progress_user_id` ON user_id
- `idx_user_progress_lesson_id` ON lesson_id
- `idx_user_progress_status` ON status

**RLS策略**:
- SELECT/UPDATE/INSERT: 仅可操作自己的记录

---

### 5. projects (用户作品表)

**描述**: 存储用户创建的HTML/CSS/JS作品

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 作品ID |
| user_id | UUID | FK→users | 创建者ID |
| title | TEXT | NOT NULL | 作品标题 |
| description | TEXT | NULLABLE | 作品描述 |
| html_code | TEXT | DEFAULT '' | HTML代码 |
| css_code | TEXT | DEFAULT '' | CSS代码 |
| js_code | TEXT | DEFAULT '' | JavaScript代码 |
| is_public | BOOLEAN | DEFAULT false | 是否公开 |
| likes_count | INTEGER | ≥0, DEFAULT 0 | 点赞数 |
| views_count | INTEGER | ≥0, DEFAULT 0 | 浏览数 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_projects_user_id` ON user_id
- `idx_projects_is_public` ON is_public
- `idx_projects_likes_count` ON likes_count DESC
- `idx_projects_created_at` ON created_at DESC

**RLS策略**:
- SELECT: 公开作品所有人可见,私有作品仅创建者可见
- INSERT/UPDATE/DELETE: 仅可操作自己的作品

---

### 6. project_likes (作品点赞表)

**描述**: 记录用户对作品的点赞

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 点赞记录ID |
| user_id | UUID | FK→users | 点赞用户ID |
| project_id | UUID | FK→projects | 作品ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 点赞时间 |

**约束**:
- UNIQUE(user_id, project_id) - 每个用户对每个作品只能点赞一次

**索引**:
- `idx_project_likes_user_id` ON user_id
- `idx_project_likes_project_id` ON project_id

**触发器**:
- 点赞/取消点赞时自动更新projects.likes_count

**RLS策略**:
- SELECT: 所有人可查看
- INSERT: 用户可添加点赞
- DELETE: 只能删除自己的点赞

---

### 7. comments (评论表)

**描述**: 存储作品评论

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 评论ID |
| user_id | UUID | FK→users | 评论者ID |
| project_id | UUID | FK→projects | 作品ID |
| content | TEXT | NOT NULL, ≤500字符 | 评论内容 |
| created_at | TIMESTAMP | DEFAULT NOW() | 评论时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

**索引**:
- `idx_comments_user_id` ON user_id
- `idx_comments_project_id` ON project_id
- `idx_comments_created_at` ON created_at DESC

**RLS策略**:
- SELECT: 所有人可查看
- INSERT: 用户可添加评论
- UPDATE/DELETE: 只能操作自己的评论

---

### 8. achievements (成就表)

**描述**: 定义可解锁的成就徽章

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 成就ID |
| code | TEXT | UNIQUE, NOT NULL | 成就唯一标识 |
| title | TEXT | NOT NULL | 成就标题 |
| description | TEXT | NOT NULL | 成就描述 |
| icon | TEXT | NOT NULL | 成就图标(emoji) |
| xp_reward | INTEGER | ≥0, DEFAULT 0 | 解锁奖励XP |
| rarity | ENUM | common/rare/epic/legendary | 稀有度 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

**索引**:
- `idx_achievements_code` ON code
- `idx_achievements_rarity` ON rarity

**RLS策略**:
- SELECT: 所有人可查看

---

### 9. user_achievements (用户成就表)

**描述**: 记录用户已解锁的成就

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | UUID | PK | 记录ID |
| user_id | UUID | FK→users | 用户ID |
| achievement_id | UUID | FK→achievements | 成就ID |
| unlocked_at | TIMESTAMP | DEFAULT NOW() | 解锁时间 |

**约束**:
- UNIQUE(user_id, achievement_id) - 每个成就每个用户只能解锁一次

**索引**:
- `idx_user_achievements_user_id` ON user_id
- `idx_user_achievements_achievement_id` ON achievement_id
- `idx_user_achievements_unlocked_at` ON unlocked_at DESC

**触发器**:
- 解锁成就时自动奖励XP到users.xp

**RLS策略**:
- SELECT: 所有人可查看
- INSERT: 仅服务端可插入(通过API)

---

## 枚举类型

### user_role
```sql
CREATE TYPE user_role AS ENUM (
  'guest',    -- 游客(试用)
  'student',  -- 学生用户
  'teacher',  -- 教师用户
  'admin'     -- 管理员
);
```

### difficulty_level
```sql
CREATE TYPE difficulty_level AS ENUM (
  'easy',     -- 简单
  'medium',   -- 中等
  'hard'      -- 困难
);
```

### lesson_status
```sql
CREATE TYPE lesson_status AS ENUM (
  'locked',      -- 锁定
  'in_progress', -- 进行中
  'completed'    -- 已完成
);
```

### achievement_rarity
```sql
CREATE TYPE achievement_rarity AS ENUM (
  'common',    -- 普通(灰色)
  'rare',      -- 稀有(蓝色)
  'epic',      -- 史诗(紫色)
  'legendary'  -- 传说(橙色)
);
```

---

## 触发器和函数

### 1. update_updated_at_column()

**作用**: 自动更新记录的updated_at字段

**触发时机**: BEFORE UPDATE

**应用表**: users, courses, lessons, user_progress, projects, comments

### 2. handle_new_user()

**作用**: 新用户注册时自动创建users表记录

**触发时机**: AFTER INSERT ON auth.users

**逻辑**:
```sql
-- 从auth.users的metadata中提取信息创建users记录
INSERT INTO public.users (id, username, display_name, avatar_url, role)
VALUES (
  NEW.id,
  NEW.raw_user_meta_data->>'username',
  NEW.raw_user_meta_data->>'display_name',
  NEW.raw_user_meta_data->>'avatar_url',
  COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
);
```

### 3. update_project_likes_count()

**作用**: 点赞/取消点赞时自动更新projects.likes_count

**触发时机**: AFTER INSERT OR DELETE ON project_likes

**逻辑**:
- INSERT时: likes_count + 1
- DELETE时: likes_count - 1

### 4. award_achievement_xp()

**作用**: 解锁成就时自动奖励XP

**触发时机**: AFTER INSERT ON user_achievements

**逻辑**:
```sql
-- 获取成就的xp_reward并加到用户XP
UPDATE public.users
SET xp = xp + (SELECT xp_reward FROM achievements WHERE id = NEW.achievement_id)
WHERE id = NEW.user_id;
```

---

## Row Level Security (RLS)

所有表均启用RLS,确保数据安全。主要策略原则:

1. **公开数据**: 所有人可SELECT
   - 已发布的courses/lessons
   - 公开的projects
   - achievements
   - project_likes, comments

2. **私有数据**: 仅所有者可访问
   - user_progress (自己的学习进度)
   - 私有projects
   - 自己的users记录

3. **角色权限**:
   - **guest**: 只读访问公开内容
   - **student**: 可创建作品、评论、记录进度
   - **teacher**: 额外可创建/编辑课程
   - **admin**: 全部权限

4. **服务端操作**: 某些敏感操作(如解锁成就)只能通过service_role_key在服务端API执行

---

## 查询示例

### 1. 获取用户完整信息(含等级)

```sql
SELECT 
  u.*,
  COUNT(DISTINCT ua.id) as achievements_count,
  COUNT(DISTINCT p.id) as projects_count,
  COUNT(DISTINCT up.id) FILTER (WHERE up.status = 'completed') as completed_lessons
FROM users u
LEFT JOIN user_achievements ua ON u.id = ua.user_id
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN user_progress up ON u.id = up.user_id
WHERE u.id = 'user_uuid'
GROUP BY u.id;
```

### 2. 获取课程及其关卡列表

```sql
SELECT 
  c.*,
  json_agg(
    json_build_object(
      'id', l.id,
      'title', l.title,
      'difficulty', l.difficulty,
      'xp_reward', l.xp_reward
    ) ORDER BY l.order
  ) as lessons
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id
WHERE c.is_published = true
GROUP BY c.id
ORDER BY c.level, c.order;
```

### 3. 获取热门作品(点赞最多)

```sql
SELECT 
  p.*,
  u.username,
  u.display_name,
  u.avatar_url,
  EXISTS (
    SELECT 1 FROM project_likes pl
    WHERE pl.project_id = p.id AND pl.user_id = 'current_user_uuid'
  ) as user_has_liked
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE p.is_public = true
ORDER BY p.likes_count DESC, p.created_at DESC
LIMIT 10;
```

### 4. 检查用户是否解锁某成就

```sql
SELECT EXISTS (
  SELECT 1 FROM user_achievements
  WHERE user_id = 'user_uuid' 
  AND achievement_id = (SELECT id FROM achievements WHERE code = 'hello_world')
) as is_unlocked;
```

### 5. 获取用户学习统计

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
  ROUND(AVG(score)) as avg_score,
  SUM(attempts) as total_attempts
FROM user_progress
WHERE user_id = 'user_uuid';
```

---

## 性能优化建议

1. **索引优化**:
   - 已为常用查询字段创建索引
   - 考虑为热门查询添加复合索引

2. **JSONB字段**:
   - lessons.content使用JSONB而非JSON以支持索引
   - 可为常用JSONB路径创建GIN索引:
     ```sql
     CREATE INDEX idx_lessons_content_type 
     ON lessons USING GIN ((content -> 'type'));
     ```

3. **分页查询**:
   - 使用LIMIT/OFFSET或cursor-based pagination
   - 避免大offset(性能差)

4. **连接优化**:
   - 合理使用JOIN vs 多次查询
   - 对于1:N关系考虑使用json_agg聚合

---

## 数据迁移和版本控制

- 所有schema变更必须通过migration文件
- Migration文件命名: `NNN_description.sql`
- 不要修改已部署的migration文件
- 使用版本号管理schema演进

---

## 安全注意事项

1. ✅ 所有表启用RLS
2. ✅ 敏感操作使用service_role_key
3. ✅ 用户输入验证(长度限制、格式校验)
4. ✅ 避免SQL注入(使用参数化查询)
5. ✅ 定期备份数据库

---

## 相关资源

- [PostgreSQL官方文档](https://www.postgresql.org/docs/)
- [Supabase RLS指南](https://supabase.com/docs/guides/auth/row-level-security)
- [数据库设计最佳实践](https://supabase.com/docs/guides/database/design-schema)

