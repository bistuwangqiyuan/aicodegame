# GameCode Lab MVP 开发计划

## 阶段1：项目初始化与基础架构

### 1.1 Next.js 14项目搭建
- 创建Next.js 14 + TypeScript项目
- 配置Tailwind CSS + shadcn/ui
- 安装核心依赖：
  - `@supabase/supabase-js` - Supabase客户端
  - `zustand` - 状态管理
  - `@monaco-editor/react` - Monaco编辑器
  - `framer-motion` - 动画库
  - `lucide-react` - 图标库

### 1.2 项目结构设计
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面组
│   ├── (dashboard)/       # 主应用页面组
│   ├── api/               # API路由
│   └── layout.tsx         # 根布局
├── components/
│   ├── ui/                # shadcn/ui组件
│   ├── editor/            # 代码编辑器组件
│   ├── gamification/      # 游戏化UI组件
│   └── course/            # 课程相关组件
├── lib/
│   ├── supabase/          # Supabase客户端配置
│   ├── deepseek/          # DeepSeek API集成
│   └── utils/             # 工具函数
├── stores/                # Zustand状态管理
└── types/                 # TypeScript类型定义
```

### 1.3 环境变量配置
创建`.env.local`模板：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_API_URL`

---

## 阶段2：Supabase数据库设计与配置

### 2.1 数据库Schema设计

#### 核心表结构：

**users表**（扩展Supabase Auth）
```sql
- id (uuid, PK, 关联auth.users)
- username (text)
- display_name (text)
- avatar_url (text)
- role (enum: guest, student, teacher, admin)
- level (integer, default: 1)
- xp (integer, default: 0)
- coins (integer, default: 0)
- trial_started_at (timestamp, nullable)
- trial_expires_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

**courses表**
```sql
- id (uuid, PK)
- title (text)
- description (text)
- level (integer: 1-5)
- order (integer)
- is_published (boolean)
- created_by (uuid, FK -> users)
- created_at (timestamp)
```

**lessons表**
```sql
- id (uuid, PK)
- course_id (uuid, FK -> courses)
- title (text)
- description (text)
- content (jsonb) # 存储课程内容和AI生成的讲解
- order (integer)
- xp_reward (integer)
- coin_reward (integer)
- difficulty (enum: easy, medium, hard)
```

**user_progress表**
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users)
- lesson_id (uuid, FK -> lessons)
- status (enum: locked, in_progress, completed)
- score (integer, nullable)
- completed_at (timestamp, nullable)
- attempts (integer, default: 0)
```

**projects表**（用户作品）
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users)
- title (text)
- description (text)
- html_code (text)
- css_code (text)
- js_code (text)
- is_public (boolean)
- likes_count (integer, default: 0)
- views_count (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)
```

**achievements表**
```sql
- id (uuid, PK)
- code (text, unique) # 如 'first_run', 'week_streak'
- title (text)
- description (text)
- icon (text)
- xp_reward (integer)
- rarity (enum: common, rare, epic, legendary)
```

**user_achievements表**
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users)
- achievement_id (uuid, FK -> achievements)
- unlocked_at (timestamp)
```

### 2.2 使用MCP工具创建数据库
- 通过`mcp_supabase_apply_migration`创建所有表
- 设置RLS（Row Level Security）策略
- 创建必要的索引和触发器

### 2.3 初始数据准备
- 创建Level 1和Level 2的课程数据（HTML5基础和CSS样式）
- 创建10个基础成就徽章
- 设置游客账号默认配置

---

## 阶段3：用户认证与游客试用系统

### 3.1 Supabase Auth集成
文件：`src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3.2 游客试用逻辑实现
文件：`src/lib/auth/guest.ts`
- 实现Supabase匿名登录（`signInAnonymously`）
- 首次访问自动创建匿名会话
- 在users表记录`trial_started_at`（30天有效期）
- 创建试用期检测中间件

### 3.3 认证页面
- `/login` - 登录页（支持邮箱 + Google OAuth）
- `/register` - 注册页
- 登录后检测是否为匿名用户，提示数据迁移

### 3.4 数据迁移功能
文件：`src/lib/auth/migrate.ts`
- 当匿名用户注