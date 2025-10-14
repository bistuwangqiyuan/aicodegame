/**
 * 全局Footer组件
 */

'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: '功能特性', href: '/features' },
      { name: '课程体系', href: '/learn' },
      { name: '定价方案', href: '/pricing' },
      { name: '更新日志', href: '/changelog' }
    ],
    resources: [
      { name: '文档中心', href: '/docs' },
      { name: '教程指南', href: '/tutorials' },
      { name: 'API 文档', href: '/api-docs' },
      { name: '常见问题', href: '/faq' }
    ],
    community: [
      { name: '社区作品', href: '/community' },
      { name: '排行榜', href: '/leaderboard' },
      { name: '论坛讨论', href: '/forum' },
      { name: 'Discord', href: '/discord' }
    ],
    company: [
      { name: '关于我们', href: '/about' },
      { name: '联系我们', href: '/contact' },
      { name: '加入我们', href: '/careers' },
      { name: '合作伙伴', href: '/partners' }
    ]
  }

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 主要内容 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo和描述 */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white">
                🎮
              </div>
              <span className="text-xl font-bold text-gray-900">
                GameCode Lab
              </span>
            </Link>

            <p className="mt-4 text-sm text-gray-600">
              游戏化的 HTML5 编程教育平台,让学习编程像玩游戏一样有趣!
              通过 AI 助教和闯关挑战,轻松掌握 Web 开发技能。
            </p>

            {/* 社交媒体 */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@gamecodelab.com"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 产品 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              产品
            </h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              资源
            </h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 社区 */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              社区
            </h3>
            <ul className="space-y-3">
              {links.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} GameCode Lab. All rights reserved.
            </p>

            <div className="flex items-center gap-1 text-sm text-gray-600">
              Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> by
              GameCode Team
            </div>

            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                服务条款
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-blue-600">
                Cookie 政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

