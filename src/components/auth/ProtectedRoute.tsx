/**
 * 受保护路由组件
 * 需要登录才能访问的页面包装器
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean // 是否需要正式账号（非游客）
  requiredRole?: 'student' | 'teacher' | 'admin' // 需要的最低角色
}

export function ProtectedRoute({
  children,
  requireAuth = false,
  requiredRole
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, profile, loading, isGuest, isTrialValid } = useAuth()

  useEffect(() => {
    if (loading) return

    // 未登录 - 重定向到登录页
    if (!user) {
      router.push('/login')
      return
    }

    // 需要正式账号但用户是游客
    if (requireAuth && isGuest) {
      // 检查试用期
      if (!isTrialValid) {
        router.push('/register')
        return
      }
    }

    // 角色权限检查
    if (requiredRole && profile) {
      const roleHierarchy = {
        guest: 0,
        student: 1,
        teacher: 2,
        admin: 3
      }

      const userRoleLevel = roleHierarchy[profile.role]
      const requiredRoleLevel = roleHierarchy[requiredRole]

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/')
        return
      }
    }
  }, [user, profile, loading, isGuest, isTrialValid, requireAuth, requiredRole, router])

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 未登录不显示内容
  if (!user) {
    return null
  }

  // 权限不足不显示内容
  if (requireAuth && isGuest && !isTrialValid) {
    return null
  }

  return <>{children}</>
}

