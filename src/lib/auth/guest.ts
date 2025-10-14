/**
 * 游客试用系统
 * 处理游客账号创建、试用期管理、数据迁移
 */

import { createClient } from '@/lib/supabase/client'
import { TRIAL_DURATION_DAYS, STORAGE_KEYS } from '@/lib/constants'

/**
 * 检查试用期是否有效
 * @param trialStartedAt - 试用开始时间
 * @param trialExpiresAt - 试用到期时间
 * @returns 是否在试用期内
 */
export function isTrialValid(
  trialStartedAt: string | null,
  trialExpiresAt: string | null
): boolean {
  if (!trialStartedAt || !trialExpiresAt) return false

  const now = new Date()
  const expiresAt = new Date(trialExpiresAt)

  return now < expiresAt
}

/**
 * 计算试用剩余天数
 * @param trialExpiresAt - 试用到期时间
 * @returns 剩余天数
 */
export function getTrialDaysRemaining(
  trialExpiresAt: string | null
): number {
  if (!trialExpiresAt) return 0

  const now = new Date()
  const expiresAt = new Date(trialExpiresAt)
  const diffTime = expiresAt.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * 创建游客账号
 * @returns 游客用户信息
 */
export async function createGuestAccount() {
  const supabase = createClient()

  // 使用Supabase匿名登录
  const { data: authData, error: authError } =
    await supabase.auth.signInAnonymously()

  if (authError || !authData.user) {
    throw new Error(`创建游客账号失败: ${authError?.message}`)
  }

  const userId = authData.user.id

  // 计算试用期
  const trialStartedAt = new Date()
  const trialExpiresAt = new Date()
  trialExpiresAt.setDate(trialExpiresAt.getDate() + TRIAL_DURATION_DAYS)

  // 创建users表记录(如果不存在)
  const { data: userData, error: userError } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        username: `guest_${userId.slice(0, 8)}`,
        display_name: '游客',
        role: 'guest',
        level: 1,
        xp: 0,
        coins: 0,
        trial_started_at: trialStartedAt.toISOString(),
        trial_expires_at: trialExpiresAt.toISOString()
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (userError) {
    throw new Error(`创建用户记录失败: ${userError.message}`)
  }

  // 保存游客ID到本地存储
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.GUEST_ID, userId)
    localStorage.setItem(
      STORAGE_KEYS.TRIAL_START,
      trialStartedAt.toISOString()
    )
  }

  return userData
}

/**
 * 获取当前游客信息
 * @returns 游客用户信息或null
 */
export async function getGuestAccount() {
  const supabase = createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user || !user.is_anonymous) return null

  // 从数据库获取完整用户信息
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('获取游客信息失败:', error)
    return null
  }

  return userData
}

/**
 * 迁移游客数据到正式账号
 * @param guestId - 游客用户ID
 * @param newUserId - 新用户ID
 * @returns 是否成功
 */
export async function migrateGuestData(
  guestId: string,
  newUserId: string
): Promise<boolean> {
  const supabase = createClient()

  try {
    // 1. 获取游客的所有数据
    const { data: guestUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', guestId)
      .single()

    if (!guestUser) return false

    // 2. 更新新用户的XP、金币、等级
    const { error: updateError } = await supabase
      .from('users')
      .update({
        xp: guestUser.xp,
        coins: guestUser.coins,
        level: guestUser.level,
        trial_started_at: null,
        trial_expires_at: null
      })
      .eq('id', newUserId)

    if (updateError) {
      console.error('更新用户数据失败:', updateError)
      return false
    }

    // 3. 迁移学习进度
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', guestId)

    if (progressData && progressData.length > 0) {
      // 删除新用户可能已有的进度记录（避免冲突）
      await supabase.from('user_progress').delete().eq('user_id', newUserId)

      // 批量插入游客的进度
      const migratedProgress = progressData.map(p => ({
        ...p,
        id: undefined, // 让数据库生成新ID
        user_id: newUserId
      }))

      await supabase.from('user_progress').insert(migratedProgress)
    }

    // 4. 迁移作品
    const { error: projectsError } = await supabase
      .from('projects')
      .update({ user_id: newUserId })
      .eq('user_id', guestId)

    if (projectsError) {
      console.error('迁移作品失败:', projectsError)
    }

    // 5. 迁移成就
    const { data: achievementsData } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', guestId)

    if (achievementsData && achievementsData.length > 0) {
      await supabase.from('user_achievements').delete().eq('user_id', newUserId)

      const migratedAchievements = achievementsData.map(a => ({
        ...a,
        id: undefined,
        user_id: newUserId
      }))

      await supabase.from('user_achievements').insert(migratedAchievements)
    }

    // 6. 清理本地存储
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.GUEST_ID)
      localStorage.removeItem(STORAGE_KEYS.TRIAL_START)
    }

    return true
  } catch (error) {
    console.error('数据迁移失败:', error)
    return false
  }
}

/**
 * 检查是否需要显示试用提醒
 * @param daysRemaining - 剩余天数
 * @returns 是否需要提醒
 */
export function shouldShowTrialReminder(daysRemaining: number): boolean {
  const REMINDER_DAYS = [7, 3, 1, 0]
  return REMINDER_DAYS.includes(daysRemaining)
}

/**
 * 获取试用提醒消息
 * @param daysRemaining - 剩余天数
 * @returns 提醒消息
 */
export function getTrialReminderMessage(daysRemaining: number): string {
  if (daysRemaining === 0) {
    return '您的试用期今天到期,请注册账号以继续学习。'
  } else if (daysRemaining === 1) {
    return '您的试用期还剩1天,立即注册可保留所有学习进度!'
  } else if (daysRemaining <= 3) {
    return `您的试用期还剩${daysRemaining}天,注册账号可永久保存学习数据。`
  } else if (daysRemaining <= 7) {
    return `您的试用期还剩${daysRemaining}天,建议尽快注册以保留学习进度。`
  }
  return ''
}

/**
 * 删除游客账号（试用期结束后清理）
 * @param guestId - 游客用户ID
 */
export async function deleteGuestAccount(guestId: string): Promise<void> {
  const supabase = createClient()

  // 注意: 由于外键CASCADE,删除users记录会自动删除相关数据
  await supabase.from('users').delete().eq('id', guestId)

  // 清理本地存储
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.GUEST_ID)
    localStorage.removeItem(STORAGE_KEYS.TRIAL_START)
  }
}

