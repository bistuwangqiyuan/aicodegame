# 🚀 Netlify部署指南

## 部署状态

✅ **已成功部署到Netlify**

- **生产URL**: https://aicodegame.netlify.app
- **最新部署**: https://68ee6a018f34116124a44e73--aicodegame.netlify.app
- **Netlify站点ID**: 5abe4551-ea62-4b5c-90a9-601d6f0232f9

## ⚠️ 重要提示：配置环境变量

网站已部署，但**需要在Netlify控制台配置环境变量**才能正常运行：

### 1. 访问Netlify环境变量设置

访问: https://app.netlify.com/sites/aicodegame/settings/env

### 2. 添加以下环境变量

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# DeepSeek AI API配置
DEEPSEEK_API_KEY=your_deepseek_api_key

# 网站配置
NEXT_PUBLIC_SITE_URL=https://aicodegame.netlify.app
```

### 3. 触发重新部署

配置环境变量后，Netlify会自动重新部署。

## 📝 获取配置信息

### Supabase配置

1. 访问: https://supabase.com/dashboard
2. 选择您的项目
3. 进入 Settings > API
4. 复制以下信息：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### DeepSeek AI API

1. 访问: https://platform.deepseek.com/
2. 获取API Key
3. 复制到 `DEEPSEEK_API_KEY`

## 🔄 本地构建和部署命令

### 构建项目

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL="your_url"; $env:NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key"; $env:DEEPSEEK_API_KEY="your_key"; pnpm build
```

### 部署到Netlify

```bash
netlify deploy --site=5abe4551-ea62-4b5c-90a9-601d6f0232f9 --dir=.next --prod
```

## 🏗️ 项目技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **AI**: DeepSeek AI
- **代码编辑器**: Monaco Editor
- **状态管理**: Zustand
- **部署**: Netlify

## 📊 项目统计

- **静态页面**: 19个
- **动态路由**: 4个 (API routes + 动态页面)
- **总包大小**: ~84.3 KB (First Load JS)
- **构建时间**: ~55秒
- **部署时间**: ~40秒

## 🔍 功能验证清单

配置好环境变量后，请验证以下功能：

- [ ] 首页正常加载
- [ ] 用户注册/登录功能
- [ ] 游客试用功能
- [ ] 课程列表展示
- [ ] 代码编辑器运行
- [ ] AI助教功能
- [ ] 社区功能
- [ ] 个人主页
- [ ] 排行榜
- [ ] 管理员/教师后台

## 📞 支持

如有问题，请查看：
- **构建日志**: https://app.netlify.com/projects/aicodegame/deploys
- **函数日志**: https://app.netlify.com/projects/aicodegame/logs/functions
- **项目文档**: README.md

---

**最后更新**: 2025-01-14
**部署版本**: v1.0.0

