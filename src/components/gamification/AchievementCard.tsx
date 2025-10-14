/**
 * 成就卡片组件
 */

'use client'

import { Lock, Check } from 'lucide-react'
import { getAchievementColor } from '@/lib/utils'
import type { Database } from '@/types/database'

type Achievement = Database['public']['Tables']['achievements']['Row']

interface AchievementCardProps {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementCard({
  achievement,
  unlocked,
  unlockedAt,
  size = 'md'
}: AchievementCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  const iconSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-all ${sizeClasses[size]} ${
        unlocked
          ? `${getAchievementColor(achievement.rarity)} border-current shadow-lg hover:scale-105`
          : 'border-gray-300 bg-gray-100 opacity-60 hover:opacity-80'
      }`}
    >
      {/* 背景装饰 */}
      {unlocked && (
        <div className="achievement-glow absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      )}

      <div className="relative">
        {/* 图标 */}
        <div className="mb-3 flex items-center justify-between">
          <div className={iconSizes[size]}>
            {unlocked ? achievement.icon : '🔒'}
          </div>

          {unlocked ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white">
              <Lock className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* 标题和描述 */}
        <h3 className={`font-bold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {achievement.title}
        </h3>
        <p className={`mt-1 ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {achievement.description}
        </p>

        {/* XP奖励 */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              unlocked
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            +{achievement.xp_reward} XP
          </span>

          <span className="text-xs font-medium uppercase text-gray-500">
            {achievement.rarity}
          </span>
        </div>

        {/* 解锁时间 */}
        {unlocked && unlockedAt && (
          <div className="mt-2 border-t pt-2 text-xs text-gray-500">
            解锁于 {new Date(unlockedAt).toLocaleDateString('zh-CN')}
          </div>
        )}
      </div>
    </div>
  )
}

