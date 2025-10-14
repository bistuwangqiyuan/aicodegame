# 🚀 GameCode Lab 部署指南

本文档提供详细的部署步骤和配置说明。

## 📋 部署前准备

### 1. 环境要求

- Node.js 18+ 
- pnpm 或 npm
- Supabase 账号
- DeepSeek API 密钥
- Netlify 账号

### 2. 环境变量配置

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

填写以下必需的环境变量:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DeepSeek AI
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-api-key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
```

### 3. Supabase 数据库设置

#### 执行 Migrations

在 Supabase Dashboard > SQL Editor 中按顺序执行以下 SQL 文件:

1. `supabase/migrations/001_create_users_table.sql`
2. `supabase/migrations/002_create_courses_and_lessons.sql`
3. `supabase/migrations/003_create_projects_and_community.sql`
4. `supabase/migrations/004_create_achievements.sql`
5. `supabase/migrations/005_add_community_features.sql`

#### 配置 Auth

在 Supabase Dashboard > Authentication > Settings:

1. 启用 Email Provider
2. 配置邮件模板
3. (可选) 配置 OAuth Providers (Google, GitHub 等)

#### 导入课程数据

```bash
# 安装依赖
pnpm install

# 导入课程数据
pnpm seed:courses
```

---

## 🌐 Netlify 部署

### 方法 1: Git 连接 (推荐)

1. **将代码推送到 GitHub/GitLab**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **连接 Netlify**

- 登录 [Netlify](https://app.netlify.com/)
- 点击 "Add new site" > "Import an existing project"
- 选择你的 Git 仓库
- 配置构建设置:
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Node version: 18

3. **配置环境变量**

在 Netlify Dashboard > Site settings > Environment variables 中添加:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_DEEPSEEK_API_KEY
NEXT_PUBLIC_APP_URL
```

4. **部署**

点击 "Deploy site" 按钮。

### 方法 2: Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化项目
netlify init

# 构建项目
npm run build

# 部署到生产环境
netlify deploy --prod
```

### 方法 3: 手动拖拽部署

1. 构建项目:

```bash
npm run build
```

2. 压缩 `.next` 目录

3. 在 Netlify Dashboard 中拖拽上传

---

## ✅ 部署后验证

### 1. 功能测试清单

- [ ] 用户注册/登录
- [ ] 游客试用功能
- [ ] 课程列表加载
- [ ] 代码编辑器正常工作
- [ ] AI 助教响应
- [ ] 关卡提交和评分
- [ ] 社区作品展示
- [ ] 排行榜更新

### 2. 性能检查

访问 [PageSpeed Insights](https://pagespeed.web.dev/) 测试性能:

- 目标: Performance Score > 80
- 首次内容绘制 (FCP) < 2s
- 最大内容绘制 (LCP) < 3s

### 3. 安全检查

确认以下安全头部已配置 (在 `netlify.toml` 中):

- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

---

## 🔧 常见问题

### 问题 1: 构建失败

**原因**: 依赖安装失败或环境变量缺失

**解决**:
```bash
# 清除缓存
rm -rf node_modules .next
pnpm install
npm run build
```

### 问题 2: Supabase 连接失败

**原因**: 环境变量配置错误

**解决**:
1. 检查 `.env.local` 中的 Supabase URL 和密钥
2. 确认 Netlify 环境变量已正确设置
3. 验证 Supabase 项目状态

### 问题 3: AI API 调用失败

**原因**: DeepSeek API 密钥无效或配额不足

**解决**:
1. 验证 API 密钥
2. 检查 DeepSeek 账户余额
3. 查看 API 调用日志

### 问题 4: Monaco Editor 加载失败

**原因**: CDN 资源加载问题

**解决**:
1. 检查网络连接
2. 使用 npm 包而非 CDN
3. 配置 webpack 打包 Monaco Editor

---

## 📊 监控和维护

### 1. 日志监控

在 Netlify Dashboard > Functions > Logs 中查看:

- API 调用日志
- 错误日志
- 性能指标

### 2. 数据库监控

在 Supabase Dashboard > Database > Logs:

- 查询性能
- 连接数
- 存储使用量

### 3. 定期备份

**Supabase 数据备份**:
- 自动备份: 每日自动备份
- 手动备份: Dashboard > Database > Backups

**代码备份**:
- Git 仓库定期推送
- 重要 tag 标记版本

---

## 🚀 性能优化

### 1. 图片优化

使用 Next.js Image 组件:

```tsx
import Image from 'next/image'

<Image 
  src="/hero.png" 
  width={800} 
  height={600} 
  alt="Hero"
/>
```

### 2. 代码分割

使用动态导入:

```tsx
const Editor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false
})
```

### 3. 缓存策略

在 `netlify.toml` 中配置:

```toml
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 📝 更新和发布

### 版本发布流程

1. **开发环境测试**

```bash
npm run dev
# 测试所有功能
```

2. **运行测试**

```bash
npm run test
npm run lint
```

3. **构建生产版本**

```bash
npm run build
```

4. **部署到 Staging**

```bash
netlify deploy
```

5. **生产环境部署**

```bash
netlify deploy --prod
```

6. **标记版本**

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

## 📞 支持和帮助

- 📖 [Next.js 文档](https://nextjs.org/docs)
- 🗄️ [Supabase 文档](https://supabase.com/docs)
- 🚀 [Netlify 文档](https://docs.netlify.com/)
- 🤖 [DeepSeek API 文档](https://platform.deepseek.com/docs)

---

## 🎉 部署成功!

恭喜! GameCode Lab 已成功部署上线!

访问你的网站并开始使用吧! 🚀

