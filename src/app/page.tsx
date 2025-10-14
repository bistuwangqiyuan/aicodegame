import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Code2,
  Gamepad2,
  Bot,
  Trophy,
  Zap,
  Users,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              <span>免费试用全部功能 30 天</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              通过游戏化闯关
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                学习 Web 开发
              </span>
            </h1>

            <p className="mb-10 text-xl text-gray-600">
              AI 助教实时指导,完成任务获得经验值和徽章
              <br />
              零基础到独立开发,让编程学习变得有趣!
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-lg">
                  开始免费学习
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/learn">
                <Button size="lg" variant="outline" className="gap-2 text-lg">
                  <Gamepad2 className="h-5 w-5" />
                  游客体验
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              无需注册即可开始学习 · 30天试用期 · 随时转为正式账号
            </p>
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute left-1/4 top-20 h-72 w-72 animate-pulse rounded-full bg-blue-200 opacity-20 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-96 w-96 animate-pulse rounded-full bg-cyan-200 opacity-20 blur-3xl delay-1000" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              为什么选择 GameCode Lab?
            </h2>
            <p className="text-lg text-gray-600">
              结合游戏化设计与 AI 技术,打造最有趣的编程学习平台
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">游戏化学习</h3>
              <p className="text-gray-600">
                等级系统、经验值、成就徽章、排行榜...
                通过游戏机制让学习充满乐趣和成就感
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">AI 智能助教</h3>
              <p className="text-gray-600">
                DeepSeek 驱动的 CodeMentor DS
                提供实时代码讲解、纠错、评分和个性化学习建议
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">在线代码沙盒</h3>
              <p className="text-gray-600">
                VS Code 同款编辑器,实时预览效果,安全执行环境,随时保存和分享作品
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">完整课程体系</h3>
              <p className="text-gray-600">
                从 HTML5 到 JavaScript,从零基础到实战项目,系统化学习 Web
                开发全栈技能
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">社区互动</h3>
              <p className="text-gray-600">
                作品展示墙、点赞评论、AI
                点评,与全球学习者交流,展示你的创意作品
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 group-hover:scale-110 group-hover:bg-yellow-600 group-hover:text-white transition-all">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">即时反馈</h3>
              <p className="text-gray-600">
                代码运行即时看效果,AI 秒级评分和建议,错误立即定位,学习效率倍增
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              5 个 Level,从零到一
            </h2>
            <p className="text-lg text-gray-600">
              系统化学习路径,循序渐进掌握 Web 开发技能
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {[
              {
                level: 1,
                title: 'HTML5 基础',
                desc: '学习网页结构、标签语义化、常用元素',
                lessons: '10-15 关卡',
                color: 'blue'
              },
              {
                level: 2,
                title: 'CSS 样式设计',
                desc: '掌握布局、颜色、字体、动画效果',
                lessons: '12-18 关卡',
                color: 'purple'
              },
              {
                level: 3,
                title: 'JavaScript 基础',
                desc: '学习变量、函数、条件、循环、事件',
                lessons: '15-20 关卡',
                color: 'green'
              },
              {
                level: 4,
                title: 'DOM 操作',
                desc: '实现动态交互、元素操作、事件监听',
                lessons: '10-15 关卡',
                color: 'orange'
              },
              {
                level: 5,
                title: '综合实战',
                desc: '完成真实项目:个人主页、计算器、小游戏',
                lessons: '5 个项目',
                color: 'red'
              }
            ].map(item => (
              <div
                key={item.level}
                className="group flex items-center gap-6 rounded-2xl border bg-white p-6 transition-all hover:shadow-lg"
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-${item.color}-100 text-2xl font-bold text-${item.color}-600 group-hover:scale-110 transition-transform`}
                >
                  {item.level}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-xl font-semibold">
                    Level {item.level}: {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                <div className="shrink-0 text-sm text-gray-500">
                  {item.lessons}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/learn">
              <Button size="lg" className="gap-2">
                查看完整课程
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              <Star className="h-4 w-4 fill-current" />
              <span>已有 10,000+ 学习者加入</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold">
              准备好开始你的编程之旅了吗?
            </h2>

            <p className="mb-10 text-xl opacity-90">
              免费试用 30 天,体验游戏化编程学习的乐趣
              <br />
              无需信用卡,随时可以升级为正式账号
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2 text-lg">
                  立即开始学习
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white bg-transparent text-lg text-white hover:bg-white/10"
                >
                  <Gamepad2 className="h-5 w-5" />
                  游客模式体验
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Code2 className="h-6 w-6 text-blue-600" />
                <span>GameCode Lab</span>
              </h3>
              <p className="text-sm text-gray-600">
                游戏化 HTML5 编程教育平台
                <br />
                让编程学习变得有趣!
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">学习</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/learn" className="hover:text-blue-600">
                    开始学习
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-blue-600">
                    课程列表
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-blue-600">
                    社区作品
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-blue-600">
                    排行榜
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">关于</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-blue-600">
                    使用文档
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-blue-600">
                    博客
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    联系我们
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">法律</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="hover:text-blue-600">
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600">
                    服务条款
                  </Link>
                </li>
                <li>
                  <Link href="/license" className="hover:text-blue-600">
                    开源许可
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
            <p>© 2024 GameCode Lab. All rights reserved. Made with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

