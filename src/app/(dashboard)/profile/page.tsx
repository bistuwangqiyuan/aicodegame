/**
 * 个人中心页面
 * 显示用户信息、等级、成就、学习统计等
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { LevelBadge } from '@/components/gamification/LevelBadge'
import { XPBar } from '@/components/gamification/XPBar'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import { Button } from '@/components/ui/button'
import { Edit, Award, Code2, Trophy, Clock } from 'lucide-react'
import { calculateLevel, formatNumber } from '@/lib/utils'

export default function ProfilePage() {
  const { profile, loading } = useAuth()
  const [achievements, setAchievements] = useState<any[]>([])
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalProjects: 0,
    totalLearningTime: 0,
    rank: 0
  })

  useEffect(() => {
    if (profile) {
      loadAchievements()
      loadStats()
    }
  }, [profile])

  const loadAchievements = async () => {
    const supabase = createClient()

    // 获取所有成就
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*')
      .order('rarity', { ascending: false })

    if (allAchievements) {
      setAchievements(allAchievements)
    }

    // 获取用户已解锁的成就
    if (profile) {
      const { data: unlocked } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', profile.id)

      if (unlocked) {
        setUserAchievements(new Set(unlocked.map(a => a.achievement_id)))
      }
    }
  }

  const loadStats = async () => {
    if (!profile) return

    const supabase = createClient()

    // 完成的关卡数
    const { count: completedCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'completed')

    // 项目数量
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)

    // 排名（根据XP）
    const { count: higherRankedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gt('xp', profile.xp)

    setStats({
      completedLessons: completedCount || 0,
      totalProjects: projectsCount || 0,
      totalLearningTime: 0, // TODO: 实现学习时长追踪
      rank: (higherRankedUsers || 0) + 1
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 个人信息卡片 */}
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          <div className="flex items-start gap-6">
            {/* 等级徽章 */}
            <div>
              <LevelBadge level={profile.level} size="lg" showTitle={false} />
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-gray-600">@{profile.username}</p>
                </div>

                <Button size="sm" variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  编辑资料
                </Button>
              </div>

              {/* XP进度条 */}
              <div className="mb-6">
                <XPBar
                  currentXP={levelInfo.currentXP}
                  nextLevelXP={levelInfo.nextLevelXP}
                  level={profile.level}
                  size="lg"
                />
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(profile.xp)}
                  </div>
                  <div className="text-sm text-gray-600">总经验值</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(profile.coins)}
                  </div>
                  <div className="text-sm text-gray-600">金币</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.completedLessons}
                  </div>
                  <div className="text-sm text-gray-600">完成关卡</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    #{stats.rank}
                  </div>
                  <div className="text-sm text-gray-600">全球排名</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 学习统计 */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">学习进度</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.completedLessons}</p>
            <p className="text-sm text-gray-600">关卡已完成</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">作品数量</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
            <p className="text-sm text-gray-600">创建的作品</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">学习时长</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.totalLearningTime}</p>
            <p className="text-sm text-gray-600">小时</p>
          </div>
        </div>

        {/* 成就墙 */}
        <div className="mt-6 rounded-2xl border bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <Award className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">成就墙</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {userAchievements.size} / {achievements.length}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {achievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={userAchievements.has(achievement.id)}
                size="md"
              />
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Award className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p>暂无成就数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

