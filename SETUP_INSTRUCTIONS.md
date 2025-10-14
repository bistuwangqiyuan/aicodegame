# 🚀 GameCode Lab - 安装配置说明

## ✅ 已完成步骤

1. ✅ **依赖安装** - 723个包已安装成功
2. ✅ **Node.js环境** - v22.14.0
3. ✅ **pnpm包管理器** - v10.15.0

---

## 📝 下一步配置（必须完成）

### 步骤1: 创建环境变量文件

创建文件 `.env.local`，内容如下：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# DeepSeek AI Configuration
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=GameCode Lab
```

### 步骤2: 获取Supabase密钥

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目（或创建新项目）
3. 进入 Settings > API
4. 复制以下内容到 `.env.local`：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

### 步骤3: 获取DeepSeek API密钥

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册/登录账号
3. 创建API密钥
4. 复制密钥到 `.env.local` 的 `NEXT_PUBLIC_DEEPSEEK_API_KEY`

### 步骤4: 执行数据库Migrations

在Supabase Dashboard > SQL Editor中，依次执行：

```
supabase/migrations/001_create_users_table.sql
supabase/migrations/002_create_courses_and_lessons.sql
supabase/migrations/003_create_projects_and_community.sql
supabase/migrations/004_create_achievements.sql
supabase/migrations/005_add_community_features.sql
```

### 步骤5: 导入课程数据

```bash
pnpm seed:courses
```

### 步骤6: 启动开发服务器

```bash
pnpm dev
```

访问: http://localhost:3000

---

## 🎯 当前项目状态

```
✅ 项目代码        - 100% 完成
✅ 依赖安装        - 100% 完成
⏳ 环境变量配置    - 等待用户操作
⏳ 数据库设置      - 等待用户操作
⏳ 课程数据导入    - 等待用户操作
```

---

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南

---

## ⚠️ 重要提示

**项目代码已100%完成，但需要您完成以下配置才能运行：**

1. 创建 `.env.local` 文件
2. 配置Supabase和DeepSeek API密钥
3. 执行数据库migrations
4. 导入课程数据

**这些步骤需要您的API密钥，无法自动完成。**

---

完成配置后，运行 `pnpm dev` 即可启动项目！🚀

