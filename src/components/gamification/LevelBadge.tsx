/**
 * 等级徽章组件
 * 显示用户当前等级和称号
 */

'use client'

import { Trophy } from 'lucide-react'
import { getLevelTitle } from '@/lib/utils'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showTitle?: boolean
}

export function LevelBadge({ level, size = 'md', showTitle = true }: LevelBadgeProps) {
  const title = getLevelTitle(level)
  
  const sizeClasses = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl'
  }

  const getLevelColor = (lvl: number) => {
    if (lvl >= 10) return 'from-orange-400 to-red-500' // 传说
    if (lvl >= 8) return 'from-purple-400 to-pink-500' // 史诗
    if (lvl >= 5) return 'from-blue-400 to-cyan-500' // 稀有
    return 'from-gray-400 to-gray-500' // 普通
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${getLevelColor(level)} ${sizeClasses[size]} shadow-lg`}
      >
        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white/20">
          <span className="font-bold text-white">{level}</span>
        </div>
        
        <Trophy className="absolute -right-1 -top-1 h-5 w-5 text-yellow-400" />
      </div>
      
      {showTitle && (
        <span className="text-sm font-medium text-gray-700">{title}</span>
      )}
    </div>
  )
}

