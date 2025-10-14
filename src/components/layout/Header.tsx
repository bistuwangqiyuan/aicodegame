/**
 * 全局Header组件
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LevelBadge } from '@/components/gamification/LevelBadge'
import {
  Menu,
  X,
  BookOpen,
  Code,
  Users,
  Trophy,
  User,
  LogOut,
  Settings,
  Home
} from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  // 如果是首页或认证页面,不显示Header
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null
  }

  const navigation = [
    { name: '首页', href: '/dashboard', icon: Home },
    { name: '学习', href: '/learn', icon: BookOpen },
    { name: '编辑器', href: '/editor', icon: Code },
    { name: '社区', href: '/community', icon: Users },
    { name: '排行榜', href: '/leaderboard', icon: Trophy }
  ]

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-xl font-bold text-white">
              🎮
            </div>
            <span className="hidden text-xl font-bold text-gray-900 sm:block">
              GameCode Lab
            </span>
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* 右侧用户信息 */}
          <div className="flex items-center gap-4">
            {profile ? (
              <>
                {/* 等级徽章 */}
                <div className="hidden sm:block">
                  <LevelBadge level={profile.level} size="sm" />
                </div>

                {/* 用户菜单 */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-sm font-semibold text-white">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.display_name || 'User'}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        (profile.display_name || profile.username || 'U')[0]
                      )}
                    </div>

                    <span className="hidden text-sm font-medium text-gray-900 md:block">
                      {profile.display_name || profile.username}
                    </span>
                  </button>

                  {/* 下拉菜单 */}
                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      ></div>

                      <div className="absolute right-0 top-12 z-20 w-56 rounded-lg border bg-white p-2 shadow-lg">
                        <Link href="/profile">
                          <button
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            <User className="h-4 w-4" />
                            个人中心
                          </button>
                        </Link>

                        {(profile.role === 'teacher' || profile.role === 'admin') && (
                          <>
                            <Link href="/teacher">
                              <button
                                onClick={() => setProfileMenuOpen(false)}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                <BookOpen className="h-4 w-4" />
                                教师工作台
                              </button>
                            </Link>

                            {profile.role === 'admin' && (
                              <Link href="/admin">
                                <button
                                  onClick={() => setProfileMenuOpen(false)}
                                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                >
                                  <Settings className="h-4 w-4" />
                                  管理后台
                                </button>
                              </Link>
                            )}
                          </>
                        )}

                        <div className="my-2 h-px bg-gray-200"></div>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">注册</Button>
                </Link>
              </div>
            )}

            {/* 移动菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 移动菜单 */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

