# 🚀 GameCode Lab - 快速开始指南

本文档帮助你在 **5分钟内** 启动项目!

---

## ⚡ 快速启动 (5分钟)

### 步骤 1: 克隆项目 (30秒)

```bash
git clone <your-repo-url> gamecode-lab
cd gamecode-lab
```

### 步骤 2: 安装依赖 (2分钟)

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 步骤 3: 配置环境变量 (1分钟)

```bash
# 复制环境变量模板
cp .env.local.example .env.local
```

编辑 `.env.local`:

```env
# Supabase (从 https://supabase.com/dashboard 获取)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DeepSeek AI (从 https://platform.deepseek.com 获取)
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 步骤 4: 设置数据库 (1分钟)

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入 SQL Editor
3. 依次执行 `supabase/migrations/` 目录下的 5个 SQL 文件:
   - 001_create_users_table.sql
   - 002_create_courses_and_lessons.sql
   - 003_create_projects_and_community.sql
   - 004_create_achievements.sql
   - 005_add_community_features.sql

### 步骤 5: 导入课程数据 (30秒)

```bash
pnpm seed:courses
```

### 步骤 6: 启动项目! (30秒)

```bash
pnpm dev
```

打开浏览器访问: http://localhost:3000

---

## 🎉 完成!

你现在可以:

1. ✅ 注册/登录账号
2. ✅ 开始学习 Level 1 课程
3. ✅ 使用在线代码编辑器
4. ✅ 与 AI 助教对话
5. ✅ 查看社区作品

---

## 📚 下一步

- 📖 阅读 [README.md](./README.md) 了解项目详情
- 🔧 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) 学习开发指南
- 🚀 参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署到生产环境

---

## ❓ 常见问题

### Q: 启动报错 "Module not found"
**A**: 重新安装依赖
```bash
rm -rf node_modules
pnpm install
```

### Q: Supabase 连接失败
**A**: 检查 `.env.local` 中的配置是否正确

### Q: AI 功能不工作
**A**: 验证 DeepSeek API 密钥是否有效

---

## 💬 获取帮助

- 📖 查看完整文档
- 🐛 报告问题: [GitHub Issues]
- 💬 加入社区讨论

---

**开始你的编程学习之旅吧!** 🚀

