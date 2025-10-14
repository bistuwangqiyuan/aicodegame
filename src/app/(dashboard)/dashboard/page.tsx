/**
 * 用户主仪表盘
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { XPBar } from '@/components/gamification/XPBar'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import {
  BookOpen,
  Code,
  Users,
  Trophy,
  TrendingUp,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react'
import { calculateLevel } from '@/lib/utils'

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalProjects: 0,
    recentAchievements: [] as any[]
  })

  useEffect(() => {
    if (profile) {
      loadUserStats()
    }
  }, [profile])

  const loadUserStats = async () => {
    if (!profile) return

    const supabase = createClient()

    // 获取完成的关卡数
    const { count: lessonsCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'completed')

    // 获取作品数
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)

    // 获取最近获得的成就
    const { data: achievementsData } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements(*)
      `)
      .eq('user_id', profile.id)
      .order('unlocked_at', { ascending: false })
      .limit(3)

    setStats({
      completedLessons: lessonsCount || 0,
      totalProjects: projectsCount || 0,
      recentAchievements: achievementsData || []
    })
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const levelInfo = calculateLevel(profile.xp)

  const quickLinks = [
    {
      title: '继续学习',
      description: '从上次的地方继续',
      icon: BookOpen,
      href: '/learn',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: '代码编辑器',
      description: '创作你的作品',
      icon: Code,
      href: '/editor',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: '社区作品',
      description: '发现优秀作品',
      icon: Users,
      href: '/community',
      color: 'from-green-400 to-green-600'
    },
    {
      title: '排行榜',
      description: '查看你的排名',
      icon: Trophy,
      href: '/leaderboard',
      color: 'from-orange-400 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            欢迎回来, {profile.display_name || profile.username}! 👋
          </h1>
          <p className="text-gray-600">准备好今天的学习挑战了吗?</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 左侧主要内容 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 进度卡片 */}
            <div className="rounded-2xl border bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  学习进度
                </h2>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {profile.xp} XP
                  </span>
                </div>
              </div>

              <XPBar
                currentXP={levelInfo.currentXP}
                nextLevelXP={levelInfo.nextLevelXP}
                level={profile.level}
                size="lg"
              />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-blue-600">
                    Level {profile.level}
                  </div>
                  <div className="text-xs text-gray-600">当前等级</div>
                </div>

                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-purple-600">
                    {stats.completedLessons}
                  </div>
                  <div className="text-xs text-gray-600">完成关卡</div>
                </div>

                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="mb-1 text-2xl font-bold text-green-600">
                    {profile.coins} 🪙
                  </div>
                  <div className="text-xs text-gray-600">金币</div>
                </div>
              </div>
            </div>

            {/* 快捷链接 */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                快捷访问
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <Link key={index} href={link.href}>
                      <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white shadow-lg`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {link.title}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {link.description}
                            </p>
                          </div>

                          <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 最近成就 */}
            <div className="rounded-2xl border bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">最近成就</h3>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    查看全部
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {stats.recentAchievements.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAchievements.map((ua) => (
                    <AchievementCard
                      key={ua.id}
                      achievement={ua.achievements}
                      size="sm"
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Award className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">还没有获得成就</p>
                  <p className="text-xs text-gray-400">继续学习来解锁!</p>
                </div>
              )}
            </div>

            {/* 每日挑战 */}
            <div className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-xl">
                  🎯
                </div>
                <h3 className="font-semibold text-gray-900">每日挑战</h3>
              </div>

              <p className="mb-4 text-sm text-gray-700">
                完成今日挑战,获得额外奖励!
              </p>

              <Button className="w-full gap-2" variant="outline">
                <TrendingUp className="h-4 w-4" />
                开始挑战
              </Button>
            </div>

            {/* 学习提示 */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-lg">
              <h3 className="mb-2 font-semibold text-gray-900">💡 学习提示</h3>
              <p className="text-sm text-gray-700">
                坚持每天学习 30 分钟,你将在一个月内掌握 Web 开发基础!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

