/**
 * 用户认证Hook
 * 管理用户登录状态、会话、认证操作
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import {
  createGuestAccount,
  getGuestAccount,
  isTrialValid,
  getTrialDaysRemaining
} from '@/lib/auth/guest'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isGuest: boolean
  isTrialValid: boolean
  trialDaysRemaining: number
}

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    isGuest: false,
    isTrialValid: false,
    trialDaysRemaining: 0
  })

  // 加载用户信息
  const loadUser = async () => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        // 如果没有用户且在浏览器环境,创建游客账号
        if (typeof window !== 'undefined') {
          try {
            const guestProfile = await createGuestAccount()
            const { data: { user: guestUser } } = await supabase.auth.getUser()
            
            setAuthState({
              user: guestUser,
              profile: guestProfile,
              loading: false,
              isGuest: true,
              isTrialValid: true,
              trialDaysRemaining: getTrialDaysRemaining(
                guestProfile.trial_expires_at
              )
            })
          } catch (error) {
            console.error('创建游客账号失败:', error)
            setAuthState(prev => ({ ...prev, loading: false }))
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
        return
      }

      // 获取用户profile
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('获取用户profile失败:', error)
        setAuthState({
          user,
          profile: null,
          loading: false,
          isGuest: user.is_anonymous || false,
          isTrialValid: false,
          trialDaysRemaining: 0
        })
        return
      }

      const isGuestUser = profile.role === 'guest' || user.is_anonymous
      const trialValid = isTrialValid(
        profile.trial_started_at,
        profile.trial_expires_at
      )
      const daysRemaining = getTrialDaysRemaining(profile.trial_expires_at)

      setAuthState({
        user,
        profile,
        loading: false,
        isGuest: isGuestUser,
        isTrialValid: trialValid,
        trialDaysRemaining: daysRemaining
      })
    } catch (error) {
      console.error('加载用户失败:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  // 监听认证状态变化
  useEffect(() => {
    loadUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  /**
   * 邮箱密码登录
   */
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    await loadUser()
    return data
  }

  /**
   * 邮箱密码注册
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
          role: 'student'
        }
      }
    })

    if (error) throw error

    await loadUser()
    return data
  }

  /**
   * OAuth登录(Google, GitHub等)
   */
  const signInWithOAuth = async (
    provider: 'google' | 'github',
    redirectTo?: string
  ) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  /**
   * 退出登录
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    setAuthState({
      user: null,
      profile: null,
      loading: false,
      isGuest: false,
      isTrialValid: false,
      trialDaysRemaining: 0
    })

    router.push('/')
  }

  /**
   * 更新用户profile
   */
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) throw new Error('未登录')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', authState.user.id)
      .select()
      .single()

    if (error) throw error

    setAuthState(prev => ({
      ...prev,
      profile: data
    }))

    return data
  }

  /**
   * 刷新用户数据
   */
  const refreshUser = async () => {
    await loadUser()
  }

  return {
    // 状态
    ...authState,

    // 方法
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
    updateProfile,
    refreshUser
  }
}

