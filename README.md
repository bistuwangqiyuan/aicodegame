# GameCode Lab - 游戏化HTML5编程教育平台

<div align="center">

🎮 **通过游戏化闯关学习Web开发** 🚀

[English](#) | [中文](#)

</div>

---

## 📋 项目概述

**GameCode Lab** 是一个基于浏览器的游戏化在线编程学习平台,让零基础用户通过任务闯关、AI实时反馈、积分与成就机制,系统掌握 HTML5、CSS、JavaScript 等 Web 基础开发技能。

### 核心特色

- 🎯 **游戏化学习**: 等级系统、经验值、成就徽章、排行榜
- 🤖 **AI智能助教**: DeepSeek驱动的代码讲解、纠错、个性化建议
- 💻 **在线代码沙盒**: 实时预览、安全执行、作品保存与分享
- 🎓 **完整课程体系**: HTML5 → CSS → JavaScript → DOM → 实战项目
- 👥 **社区互动**: 作品展示墙、点赞评论、AI点评
- 🎁 **免费试用**: 游客可免费体验全部功能1个月

---

## 🛠 技术栈

### 前端框架
- **Next.js 14**: React全栈框架,App Router
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **shadcn/ui**: 高质量React组件库

### 后端服务
- **Supabase**: PostgreSQL数据库 + 认证 + Edge Functions
- **DeepSeek AI**: 代码生成、讲解、纠错引擎

### 核心库
- **@monaco-editor/react**: VS Code同款代码编辑器
- **Framer Motion**: 流畅动画库
- **Zustand**: 轻量级状态管理
- **Lucide React**: 图标库

### 开发工具
- **Cursor**: AI编程辅助工具
- **ESLint + Prettier**: 代码规范
- **pnpm**: 高效包管理器

### 部署平台
- **Netlify**: 静态站点 + Serverless Functions

---

## 📁 项目结构

```
aicodegame/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # 认证相关页面组
│   │   │   ├── login/           # 登录页
│   │   │   ├── register/        # 注册页
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # 主应用页面组
│   │   │   ├── learn/           # 学习中心
│   │   │   ├── editor/          # 代码编辑器
│   │   │   ├── community/       # 社区作品
│   │   │   ├── profile/         # 个人中心
│   │   │   ├── leaderboard/     # 排行榜
│   │   │   └── layout.tsx
│   │   ├── teacher/             # 教师后台
│   │   ├── admin/               # 管理员后台
│   │   ├── api/                 # API路由
│   │   │   ├── ai/              # DeepSeek AI接口
│   │   │   ├── code/            # 代码执行与评分
│   │   │   └── webhooks/        # Webhook处理
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   ├── components/              # React组件
│   │   ├── ui/                  # shadcn/ui基础组件
│   │   ├── editor/              # 代码编辑器组件
│   │   │   ├── CodeEditor.tsx   # Monaco编辑器封装
│   │   │   ├── PreviewPane.tsx  # 实时预览面板
│   │   │   └── Console.tsx      # 控制台输出
│   │   ├── gamification/        # 游戏化UI组件
│   │   │   ├── LevelBadge.tsx   # 等级徽章
│   │   │   ├── XPBar.tsx        # 经验值进度条
│   │   │   ├── Achievement.tsx  # 成就卡片
│   │   │   └── Leaderboard.tsx  # 排行榜
│   │   ├── course/              # 课程相关组件
│   │   │   ├── LessonCard.tsx   # 课程卡片
│   │   │   ├── LevelMap.tsx     # 关卡地图
│   │   │   └── TaskPanel.tsx    # 任务面板
│   │   ├── ai/                  # AI助教组件
│   │   │   ├── ChatBot.tsx      # 聊天窗口
│   │   │   ├── CodeExplainer.tsx # 代码讲解面板
│   │   │   └── FeedbackCard.tsx # AI反馈卡片
│   │   └── layout/              # 布局组件
│   │       ├── Header.tsx       # 页头
│   │       ├── Sidebar.tsx      # 侧边栏
│   │       └── Footer.tsx       # 页脚
│   ├── lib/                     # 工具库
│   │   ├── supabase/            # Supabase客户端
│   │   │   ├── client.ts        # 浏览器端客户端
│   │   │   ├── server.ts        # 服务端客户端
│   │   │   └── middleware.ts    # 认证中间件
│   │   ├── deepseek/            # DeepSeek API集成
│   │   │   ├── client.ts        # API客户端
│   │   │   ├── prompts.ts       # AI提示词模板
│   │   │   └── types.ts         # 类型定义
│   │   ├── utils/               # 工具函数
│   │   │   ├── code-runner.ts   # 代码执行引擎
│   │   │   ├── xp-calculator.ts # 经验值计算
│   │   │   └── validators.ts    # 数据验证
│   │   └── constants.ts         # 全局常量
│   ├── stores/                  # Zustand状态管理
│   │   ├── user-store.ts        # 用户状态
│   │   ├── course-store.ts      # 课程状态
│   │   ├── editor-store.ts      # 编辑器状态
│   │   └── ui-store.ts          # UI状态
│   ├── types/                   # TypeScript类型
│   │   ├── database.ts          # 数据库类型
│   │   ├── api.ts               # API类型
│   │   └── components.ts        # 组件Props类型
│   ├── hooks/                   # 自定义React Hooks
│   │   ├── useAuth.ts           # 认证Hook
│   │   ├── useAI.ts             # AI助教Hook
│   │   └── useCodeRunner.ts     # 代码执行Hook
│   └── styles/                  # 全局样式
│       ├── globals.css          # 全局CSS
│       └── themes/              # 主题配置
├── public/                      # 静态资源
│   ├── images/                  # 图片资源
│   ├── sounds/                  # 音效文件
│   └── animations/              # 动画资源
├── supabase/                    # Supabase配置
│   ├── migrations/              # 数据库迁移文件
│   └── functions/               # Edge Functions
├── tests/                       # 测试文件
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── e2e/                     # 端到端测试
├── docs/                        # 项目文档
│   ├── api/                     # API文档
│   ├── database/                # 数据库文档
│   └── guides/                  # 开发指南
├── .env.local.example           # 环境变量模板
├── .eslintrc.json               # ESLint配置
├── .prettierrc                  # Prettier配置
├── next.config.js               # Next.js配置
├── tailwind.config.ts           # Tailwind配置
├── tsconfig.json                # TypeScript配置
├── package.json                 # 项目依赖
└── README.md                    # 项目说明
```

---

## 🚀 快速开始

### 前置要求

- **Node.js**: ≥18.0.0
- **pnpm**: ≥8.0.0
- **Supabase账号**: [注册地址](https://supabase.com)
- **DeepSeek API Key**: [获取地址](https://platform.deepseek.com)

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/aicodegame.git
cd aicodegame
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

复制`.env.local.example`为`.env.local`,填写配置:

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# DeepSeek AI配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
TRIAL_DURATION_DAYS=30
```

4. **初始化Supabase数据库**

使用Supabase MCP工具创建数据库表(详见`docs/database/schema.md`)

5. **启动开发服务器**

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

---

## 🎓 学习路径

### Level 1: HTML5基础 (10-15关卡)
- 学习HTML标签结构
- 理解语义化HTML
- 掌握常用标签使用

### Level 2: CSS样式 (12-18关卡)
- 颜色与字体
- 盒模型与布局
- Flexbox与Grid
- CSS动画

### Level 3: JavaScript基础 (15-20关卡)
- 变量与数据类型
- 函数与作用域
- 条件判断与循环
- 事件处理

### Level 4: DOM操作 (10-15关卡)
- 元素选择与操作
- 事件监听
- 动态修改页面

### Level 5: 综合实战 (5个项目)
- 个人主页
- 计算器应用
- 待办清单
- 小游戏
- 作品集网站

---

## 🤖 AI助教功能

### CodeMentor DS 能力

- ✅ **实时代码讲解**: 逐行注释与解释
- ✅ **自动评分**: 功能完整性、代码规范、性能优化
- ✅ **错误提示**: 语法错误、逻辑错误智能诊断
- ✅ **个性化建议**: 基于学习数据的定制化学习路径
- ✅ **自动出题**: 动态生成测验题目
- ✅ **聊天指导**: 自然语言交互解答问题
- ✅ **代码优化**: 对比用户代码与最佳实践

---

## 🎮 游戏化机制

### 等级系统
- **Lv1 新手**: 0-100 XP
- **Lv2 学徒**: 101-300 XP
- **Lv3 练习生**: 301-600 XP
- **Lv4 开发者**: 601-1000 XP
- **Lv5 工程师**: 1001-1500 XP
- **Lv6 专家**: 1501-2200 XP
- **Lv7 大师**: 2201-3000 XP
- **Lv8 宗师**: 3001-4000 XP
- **Lv9 传奇**: 4001-5500 XP
- **Lv10 网页高手**: 5501+ XP

### 成就徽章
- 🏆 **Hello World**: 首次运行代码成功
- 🔥 **坚持不懈**: 连续7天学习
- ⚡ **完美主义者**: 挑战无错误通过
- 💡 **乐于助人**: 帮助他人(评论或点赞)
- 🎓 **编程毕业生**: 完成所有Level 1-5课程
- 👑 **Boss杀手**: 连续击败3次AI Boss
- ⭐ **作品之星**: 作品获得100+点赞

### 金币系统
- 完成任务获得金币
- 购买编辑器主题
- 解锁特殊头像框
- 购买专属称号

---

## 📊 数据库Schema

### 核心表结构

#### users表 (用户信息)
```sql
- id: uuid (PK)
- username: text
- display_name: text
- avatar_url: text
- role: enum (guest, student, teacher, admin)
- level: integer
- xp: integer
- coins: integer
- trial_started_at: timestamp
- trial_expires_at: timestamp
```

#### courses表 (课程)
```sql
- id: uuid (PK)
- title: text
- description: text
- level: integer (1-5)
- order: integer
- is_published: boolean
```

#### lessons表 (课程关卡)
```sql
- id: uuid (PK)
- course_id: uuid (FK)
- title: text
- content: jsonb
- xp_reward: integer
- coin_reward: integer
- difficulty: enum
```

#### projects表 (用户作品)
```sql
- id: uuid (PK)
- user_id: uuid (FK)
- title: text
- html_code: text
- css_code: text
- js_code: text
- is_public: boolean
- likes_count: integer
```

完整Schema详见 `docs/database/schema.md`

---

## 🔐 安全与性能

### 安全措施
- ✅ 代码沙盒隔离执行(Iframe + CSP)
- ✅ Supabase JWT认证
- ✅ API限流保护(游客10次/小时,注册用户50次/小时)
- ✅ XSS与CSRF防护
- ✅ 敏感数据加密存储

### 性能优化
- ✅ Next.js SSR与SSG混合渲染
- ✅ 图片懒加载与CDN加速
- ✅ 代码分割与按需加载
- ✅ Supabase连接池优化
- ✅ 缓存策略(静态资源+API响应)

---

## 🧪 测试

### 运行测试

```bash
# 单元测试
pnpm test:unit

# 集成测试
pnpm test:integration

# E2E测试
pnpm test:e2e

# 覆盖率报告
pnpm test:coverage
```

### 测试要求
- 单元测试覆盖率 ≥80%
- 核心功能必须有E2E测试
- 每个API端点必须有集成测试

---

## 📦 部署

### Netlify部署

1. **构建项目**

```bash
pnpm build
```

2. **部署到Netlify**

```bash
pnpm netlify:deploy
```

### 环境变量配置

在Netlify控制台配置以下环境变量:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY`

---

## 🗓 开发任务清单

### 阶段1: 项目初始化 ✅
- [x] 创建Next.js 14项目
- [x] 配置Tailwind CSS + shadcn/ui
- [x] 安装核心依赖
- [x] 创建项目文档

### 阶段2: 数据库设计 🔄
- [ ] 使用Supabase MCP创建数据库表
- [ ] 设置RLS策略
- [ ] 创建初始数据

### 阶段3: 用户认证 ⏳
- [ ] 集成Supabase Auth
- [ ] 实现游客试用逻辑
- [ ] 开发登录/注册页面
- [ ] 数据迁移功能

### 阶段4: 代码编辑器 ⏳
- [ ] 集成Monaco Editor
- [ ] 实时预览沙盒
- [ ] 代码保存与恢复
- [ ] 导出与部署功能

### 阶段5: AI集成 ⏳
- [ ] 集成DeepSeek API
- [ ] 代码讲解功能
- [ ] 自动评分引擎
- [ ] 聊天式助教

### 阶段6: 游戏化系统 ⏳
- [ ] 等级与经验值系统
- [ ] 成就系统
- [ ] 排行榜
- [ ] 金币商店

### 阶段7: 课程内容 ⏳
- [ ] Level 1-5课程创建
- [ ] 关卡设计
- [ ] AI生成关卡功能

### 阶段8: 社区功能 ⏳
- [ ] 作品展示墙
- [ ] 点赞评论收藏
- [ ] AI作品点评

### 阶段9: 教师与管理员 ⏳
- [ ] 教师后台
- [ ] 管理员后台
- [ ] 课程审核系统

### 阶段10: UI优化 ⏳
- [ ] 动画效果(Framer Motion)
- [ ] 响应式布局
- [ ] 国际化支持
- [ ] 无障碍访问

### 阶段11: 测试 ⏳
- [ ] 编写测试用例
- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E测试

### 阶段12: 部署 ⏳
- [ ] 生产环境配置
- [ ] Netlify部署
- [ ] 性能优化
- [ ] 监控与日志

---

## 🤝 贡献指南

我们欢迎任何形式的贡献!

### 开发规范

1. **代码风格**: 遵循ESLint + Prettier规则
2. **提交信息**: 使用[Conventional Commits](https://www.conventionalcommits.org/)
3. **分支管理**: `main`(生产) / `develop`(开发) / `feature/*`(功能)
4. **测试要求**: 新功能必须包含测试用例

### 提交流程

1. Fork本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建Pull Request

---

## 📝 许可证

本项目采用 **MIT License** 开源许可证。

---

## 👥 团队

- **项目负责人**: @yourusername
- **前端开发**: @frontend-dev
- **后端开发**: @backend-dev
- **UI/UX设计**: @designer

---

## 📞 联系我们

- **项目主页**: https://gamecodelab.com
- **GitHub Issues**: https://github.com/yourusername/aicodegame/issues
- **邮箱**: support@gamecodelab.com
- **Discord社区**: https://discord.gg/gamecodelab

---

## 🙏 致谢

- [Next.js](https://nextjs.org) - React全栈框架
- [Supabase](https://supabase.com) - 开源Firebase替代品
- [DeepSeek](https://www.deepseek.com) - AI代码助手
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 代码编辑器
- [shadcn/ui](https://ui.shadcn.com) - 组件库

---

<div align="center">

**🚀 让编程学习变得有趣!**

Made with ❤️ by GameCode Lab Team

[开始学习](https://gamecodelab.com) | [查看文档](./docs) | [加入社区](https://discord.gg/gamecodelab)

</div>

