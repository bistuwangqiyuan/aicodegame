/**
 * 经验值进度条组件
 */

'use client'

import { formatNumber } from '@/lib/utils'
import { Zap } from 'lucide-react'

interface XPBarProps {
  currentXP: number
  nextLevelXP: number
  level: number
  showNumbers?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function XPBar({
  currentXP,
  nextLevelXP,
  level,
  showNumbers = true,
  size = 'md'
}: XPBarProps) {
  const progress = (currentXP / nextLevelXP) * 100

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  return (
    <div className="w-full">
      {showNumbers && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-medium text-gray-700">
              Level {level}
            </span>
          </div>
          <span className="text-gray-600">
            {formatNumber(currentXP)} / {formatNumber(nextLevelXP)} XP
          </span>
        </div>
      )}

      <div className={`w-full overflow-hidden rounded-full bg-gray-200 ${heightClasses[size]}`}>
        <div
          className="xp-bar-fill h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="h-full w-full animate-pulse bg-white/20"></div>
        </div>
      </div>

      {showNumbers && (
        <div className="mt-1 text-right text-xs text-gray-500">
          {Math.round(progress)}% 至下一级
        </div>
      )}
    </div>
  )
}

