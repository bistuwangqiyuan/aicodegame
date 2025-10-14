# GameCode Lab 开发指南

## 📋 项目当前状态

### ✅ 已完成

1. **项目文档** (2024-01-XX)
   - ✅ README.md - 完整的项目说明文档
   - ✅ DEVELOPMENT.md - 开发指南(当前文档)
   - ✅ docs/database/SCHEMA.md - 数据库架构详细文档
   - ✅ supabase/README.md - 数据库迁移指南

2. **Next.js项目结构** (2024-01-XX)
   - ✅ Next.js 14 + TypeScript配置
   - ✅ Tailwind CSS配置(含游戏化配色)
   - ✅ ESLint + Prettier代码规范
   - ✅ 项目目录结构
   - ✅ 全局样式和动画

3. **数据库Schema** (2024-01-XX)
   - ✅ 4个migration文件(users, courses/lessons, projects/community, achievements)
   - ✅ 9个核心数据表
   - ✅ RLS策略和权限控制
   - ✅ 触发器和自动化函数
   - ✅ 20个预定义成就数据

4. **Supabase集成** (2024-01-XX)
   - ✅ Supabase客户端配置(浏览器端/服务端)
   - ✅ TypeScript类型定义
   - ✅ 数据库连接测试

5. **基础UI组件** (2024-01-XX)
   - ✅ Button组件(shadcn/ui)
   - ✅ Toast通知组件
   - ✅ 工具函数库(utils.ts)
   - ✅ 全局常量配置(constants.ts)

6. **首页设计** (2024-01-XX)
   - ✅ Hero区域
   - ✅ 功能特色展示
   - ✅ 学习路径展示
   - ✅ CTA和页脚

---

## 🚧 待开发功能

### 高优先级

1. **用户认证系统** (todo_4_auth)
   - [ ] Supabase Auth集成
   - [ ] 游客试用逻辑(30天)
   - [ ] 登录/注册页面
   - [ ] 数据迁移功能

2. **在线代码编辑器** (todo_5_editor)
   - [ ] Monaco Editor集成
   - [ ] HTML/CSS/JS三栏布局
   - [ ] 实时预览沙盒(Iframe)
   - [ ] 代码保存与恢复

3. **DeepSeek AI集成** (todo_6_ai_integration)
   - [ ] API客户端封装
   - [ ] 代码讲解功能
   - [ ] 自动评分系统
   - [ ] 错误诊断提示

4. **游戏化系统** (todo_7_gamification)
   - [ ] XP/等级计算逻辑
   - [ ] 成就解锁系统
   - [ ] 排行榜功能
   - [ ] 金币商店

### 中优先级

5. **课程内容创建** (todo_8_courses)
   - [ ] Level 1: HTML5基础课程(10-15关卡)
   - [ ] Level 2: CSS样式课程(12-18关卡)
   - [ ] Level 3: JavaScript基础(15-20关卡)
   - [ ] Level 4: DOM操作(10-15关卡)
   - [ ] Level 5: 综合实战项目(5个)

6. **社区功能** (todo_9_community)
   - [ ] 作品展示墙
   - [ ] 点赞/评论/收藏
   - [ ] AI作品点评
   - [ ] 推荐算法

7. **教师/管理员后台** (todo_10_teacher_admin)
   - [ ] 教师课程创建界面
   - [ ] 学生进度查看
   - [ ] 管理员监控面板
   - [ ] 课程审核系统

### 低优先级

8. **UI优化** (todo_11_ui_polish)
   - [ ] 动画效果完善
   - [ ] 响应式布局优化
   - [ ] 主题切换
   - [ ] 国际化支持

9. **测试** (todo_12_testing)
   - [ ] 单元测试
   - [ ] 集成测试
   - [ ] E2E测试

10. **部署** (todo_13_deployment)
    - [ ] Netlify配置
    - [ ] 环境变量设置
    - [ ] 生产环境优化

---

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装Node.js依赖
pnpm install
```

### 2. 配置环境变量

创建`.env.local`文件:

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# DeepSeek AI配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
TRIAL_DURATION_DAYS=30
```

### 3. 初始化Supabase数据库

**方法1: 通过Supabase Dashboard**

1. 访问 https://app.supabase.com
2. 选择项目: `zzyueuweeoakopuuwfau`
3. 进入SQL Editor
4. 按顺序执行migration文件:
   - `supabase/migrations/001_create_users_table.sql`
   - `supabase/migrations/002_create_courses_and_lessons.sql`
   - `supabase/migrations/003_create_projects_and_community.sql`
   - `supabase/migrations/004_create_achievements.sql`

**方法2: 通过Supabase CLI**

```bash
# 安装Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref zzyueuweeoakopuuwfau

# 执行migrations
supabase db push

# 生成TypeScript类型
npm run supabase:types
```

### 4. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

---

## 📂 项目结构说明

```
aicodegame/
├── src/
│   ├── app/                      # Next.js App Router页面
│   │   ├── (auth)/              # 认证页面组(登录/注册)
│   │   ├── (dashboard)/         # 主应用页面(学习中心/编辑器/社区)
│   │   ├── api/                 # API路由(AI接口/代码评分)
│   │   ├── globals.css          # 全局样式(含动画)
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   ├── components/              # React组件
│   │   ├── ui/                  # shadcn/ui基础组件
│   │   ├── editor/              # 代码编辑器组件
│   │   ├── gamification/        # 游戏化UI组件
│   │   ├── course/              # 课程组件
│   │   ├── ai/                  # AI助教组件
│   │   └── layout/              # 布局组件
│   ├── lib/                     # 工具库
│   │   ├── supabase/            # Supabase客户端
│   │   │   ├── client.ts        # 浏览器端客户端
│   │   │   └── server.ts        # 服务端客户端
│   │   ├── utils.ts             # 工具函数(XP计算/格式化等)
│   │   └── constants.ts         # 全局常量
│   ├── stores/                  # Zustand状态管理
│   ├── types/                   # TypeScript类型
│   │   └── database.ts          # Supabase数据库类型
│   └── hooks/                   # 自定义React Hooks
│       └── use-toast.ts         # Toast通知Hook
├── supabase/                    # Supabase配置
│   ├── migrations/              # 数据库迁移文件(4个SQL文件)
│   └── README.md                # 迁移指南
├── docs/                        # 项目文档
│   └── database/                # 数据库文档
│       └── SCHEMA.md            # 数据库架构详细说明
├── public/                      # 静态资源
├── tests/                       # 测试文件
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript配置
├── tailwind.config.ts           # Tailwind配置(含游戏化主题)
├── next.config.js               # Next.js配置
├── README.md                    # 项目说明
├── DEVELOPMENT.md               # 开发指南(当前文档)
├── plan.md                      # 开发计划
└── requirements.md              # 需求文档
```

---

## 🎯 下一步开发建议

### 阶段1: 核心功能MVP(最小可行产品)

**目标**: 实现基本的编程学习流程

1. **用户认证** (预计2-3天)
   - 实现Supabase Auth登录/注册
   - 游客试用逻辑
   - 创建认证相关页面

2. **代码编辑器** (预计3-4天)
   - 集成Monaco Editor
   - 实现实时预览
   - 代码保存功能

3. **第一个课程** (预计2-3天)
   - 创建Level 1: HTML5基础(5-10个简单关卡)
   - 关卡数据写入数据库
   - 学习进度追踪

4. **基础游戏化** (预计2天)
   - XP/等级显示
   - 完成关卡奖励XP
   - 解锁第一个成就

**总计**: 约2周MVP完成

### 阶段2: AI功能集成

1. DeepSeek API集成
2. 代码讲解功能
3. 自动评分系统
4. AI助教聊天

### 阶段3: 完整内容填充

1. 完成Level 2-5所有课程
2. 社区功能开发
3. 教师/管理员后台

### 阶段4: 打磨与上线

1. UI/UX优化
2. 性能优化
3. 完整测试
4. 生产环境部署

---

## 🔧 开发规范

### 代码规范

- ✅ 使用TypeScript严格模式
- ✅ 遵循ESLint规则
- ✅ 使用Prettier格式化代码
- ✅ 组件使用函数式组件+Hooks
- ✅ 优先使用服务端组件(RSC)

### 命名规范

- **文件名**: kebab-case (例如: `code-editor.tsx`)
- **组件名**: PascalCase (例如: `CodeEditor`)
- **函数名**: camelCase (例如: `calculateLevel`)
- **常量**: UPPER_SNAKE_CASE (例如: `MAX_LEVEL`)
- **类型**: PascalCase (例如: `UserProfile`)

### Git提交规范

使用[Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: 添加代码编辑器组件
fix: 修复XP计算错误
docs: 更新README文档
style: 调整按钮样式
refactor: 重构用户认证逻辑
test: 添加单元测试
chore: 更新依赖版本
```

---

## 🐛 调试技巧

### 查看Supabase日志

```bash
# 查看数据库日志
supabase logs db

# 查看API日志
supabase logs api
```

### Next.js调试

```bash
# 启动调试模式
NODE_OPTIONS='--inspect' pnpm dev

# 在Chrome中打开: chrome://inspect
```

### 数据库查询测试

使用Supabase Dashboard的SQL Editor测试查询:

```sql
-- 查看所有表
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 测试用户创建
INSERT INTO public.users (id, username) VALUES ('test-uuid', 'testuser');

-- 检查RLS策略
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## 📚 学习资源

### 官方文档

- [Next.js 14文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [TypeScript文档](https://www.typescriptlang.org/docs)
- [Monaco Editor文档](https://microsoft.github.io/monaco-editor/)

### 相关教程

- [Next.js + Supabase教程](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [RLS最佳实践](https://supabase.com/docs/guides/auth/row-level-security)
- [游戏化设计指南](https://www.gamified.uk/gamification-framework/)

---

## 🤝 协作流程

### 分支策略

- `main` - 生产环境代码
- `develop` - 开发环境代码
- `feature/*` - 功能分支
- `bugfix/*` - Bug修复分支

### Pull Request流程

1. 从`develop`创建功能分支
2. 开发并提交代码
3. 创建PR到`develop`
4. 代码审查
5. 合并到`develop`
6. 定期合并`develop`到`main`

---

## 📊 性能监控

### 核心指标

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

### 监控工具

- Lighthouse CI
- Vercel Analytics (如果部署到Vercel)
- Supabase Dashboard监控

---

## 🔒 安全检查清单

- [x] 所有表启用RLS
- [x] 环境变量不提交到Git
- [x] API限流保护
- [x] 用户输入验证
- [ ] HTTPS强制
- [ ] CSRF防护
- [ ] XSS防护
- [ ] SQL注入防护

---

## 📞 需要帮助?

- **GitHub Issues**: [提交问题](https://github.com/yourusername/aicodegame/issues)
- **Discord社区**: [加入讨论](https://discord.gg/gamecodelab)
- **邮箱**: dev@gamecodelab.com

---

## 🎉 贡献者

感谢所有为GameCode Lab做出贡献的开发者!

---

**最后更新**: 2024-01-XX  
**当前版本**: v0.1.0 (MVP开发中)  
**下一个里程碑**: 完成用户认证和代码编辑器 (预计2周)

