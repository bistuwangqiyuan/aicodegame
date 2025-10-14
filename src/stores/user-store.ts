/**
 * 用户状态管理Store (Zustand)
 * 管理用户信息、XP、等级、金币等游戏化数据
 */

import { create } from 'zustand'
import type { Database } from '@/types/database'
import { calculateLevel } from '@/lib/utils'

type UserProfile = Database['public']['Tables']['users']['Row']

interface UserStore {
  // 状态
  user: UserProfile | null
  isLoading: boolean

  // 计算属性
  currentLevel: number
  levelProgress: number
  nextLevelXP: number

  // 操作
  setUser: (user: UserProfile | null) => void
  addXP: (amount: number) => void
  addCoins: (amount: number) => void
  updateLevel: () => void
  reset: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  // 初始状态
  user: null,
  isLoading: true,
  currentLevel: 1,
  levelProgress: 0,
  nextLevelXP: 100,

  // 设置用户
  setUser: user => {
    if (!user) {
      set({
        user: null,
        isLoading: false,
        currentLevel: 1,
        levelProgress: 0,
        nextLevelXP: 100
      })
      return
    }

    const levelInfo = calculateLevel(user.xp)

    set({
      user,
      isLoading: false,
      currentLevel: levelInfo.level,
      levelProgress: levelInfo.progress,
      nextLevelXP: levelInfo.nextLevelXP
    })
  },

  // 添加经验值
  addXP: amount => {
    const { user } = get()
    if (!user) return

    const newXP = user.xp + amount
    const newUser = { ...user, xp: newXP }

    // 重新计算等级
    const levelInfo = calculateLevel(newXP)

    set({
      user: newUser,
      currentLevel: levelInfo.level,
      levelProgress: levelInfo.progress,
      nextLevelXP: levelInfo.nextLevelXP
    })

    // 如果升级了,更新数据库中的level字段
    if (levelInfo.level > user.level) {
      get().updateLevel()
    }
  },

  // 添加金币
  addCoins: amount => {
    const { user } = get()
    if (!user) return

    const newCoins = user.coins + amount
    const newUser = { ...user, coins: newCoins }

    set({ user: newUser })
  },

  // 更新等级
  updateLevel: () => {
    const { user, currentLevel } = get()
    if (!user) return

    // 如果等级变化,更新user对象
    if (currentLevel !== user.level) {
      set({
        user: { ...user, level: currentLevel }
      })
    }
  },

  // 重置状态
  reset: () => {
    set({
      user: null,
      isLoading: false,
      currentLevel: 1,
      levelProgress: 0,
      nextLevelXP: 100
    })
  }
}))

