/**
 * 排行榜页面
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { LevelBadge } from '@/components/gamification/LevelBadge'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

type LeaderboardUser = {
  id: string
  username: string
  display_name: string | null
  level: number
  xp: number
  rank: number
}

export default function LeaderboardPage() {
  const { profile } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [myRank, setMyRank] = useState<LeaderboardUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [profile])

  const loadLeaderboard = async () => {
    const supabase = createClient()

    // 获取前100名
    const { data: topUsers } = await supabase
      .from('users')
      .select('id, username, display_name, level, xp')
      .order('xp', { ascending: false })
      .limit(100)

    if (topUsers) {
      const rankedUsers = topUsers.map((user, index) => ({
        ...user,
        rank: index + 1
      }))
      setLeaderboard(rankedUsers)

      // 如果当前用户在前100名中
      if (profile) {
        const userInTop = rankedUsers.find(u => u.id === profile.id)
        if (userInTop) {
          setMyRank(userInTop)
        } else {
          // 获取当前用户排名
          const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gt('xp', profile.xp)

          setMyRank({
            id: profile.id,
            username: profile.username || '',
            display_name: profile.display_name,
            level: profile.level,
            xp: profile.xp,
            rank: (count || 0) + 1
          })
        }
      }
    }

    setLoading(false)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">全球排行榜</h1>
          <p className="text-gray-600">与全球学习者一起竞技!</p>
        </div>

        {/* 我的排名卡片 */}
        {myRank && (
          <div className="mb-6 rounded-2xl border-2 border-blue-500 bg-blue-50 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">你的排名</p>
                  <p className="text-2xl font-bold text-blue-900">#{myRank.rank}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <LevelBadge level={myRank.level} size="sm" showTitle={false} />
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {myRank.display_name || myRank.username}
                  </p>
                  <p className="text-sm text-blue-600">{formatNumber(myRank.xp)} XP</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        <div className="rounded-2xl border bg-white shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-3 font-semibold text-gray-700">
            <div className="col-span-1">排名</div>
            <div className="col-span-6">用户</div>
            <div className="col-span-2 text-center">等级</div>
            <div className="col-span-3 text-right">经验值</div>
          </div>

          <div className="divide-y">
            {leaderboard.map(user => {
              const isCurrentUser = profile?.id === user.id

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${
                    isCurrentUser
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 排名 */}
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(user.rank)}
                  </div>

                  {/* 用户信息 */}
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-bold text-white">
                      {(user.display_name || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                        {user.display_name || user.username}
                        {isCurrentUser && (
                          <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                            你
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  {/* 等级 */}
                  <div className="col-span-2 flex items-center justify-center">
                    <LevelBadge level={user.level} size="sm" showTitle={false} />
                  </div>

                  {/* 经验值 */}
                  <div className="col-span-3 flex items-center justify-end">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatNumber(user.xp)}</p>
                      <p className="text-xs text-gray-500">XP</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Award className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p>暂无排行榜数据</p>
            </div>
          )}
        </div>

        {/* 提示信息 */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
          💡 完成更多关卡、获得高分、解锁成就可以获得更多XP,提升排名!
        </div>
      </div>
    </div>
  )
}

