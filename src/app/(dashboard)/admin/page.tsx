/**
 * 管理员后台主页
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Users,
  BookOpen,
  Award,
  AlertTriangle,
  TrendingUp,
  Settings
} from 'lucide-react'
import Link from 'next/link'

type Stats = {
  totalUsers: number
  activeCourses: number
  totalProjects: number
  pendingReports: number
}

export default function AdminPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeCourses: 0,
    totalProjects: 0,
    pendingReports: 0
  })

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role !== 'admin' && profile.role !== 'teacher') {
        router.push('/')
        return
      }

      loadStats()
    }
  }, [loading, profile])

  const loadStats = async () => {
    const supabase = createClient()

    // 获取用户总数
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 获取已发布课程数
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)

    // 获取作品总数
    const { count: projectsCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // 获取待处理举报数
    const { count: reportsCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    setStats({
      totalUsers: usersCount || 0,
      activeCourses: coursesCount || 0,
      totalProjects: projectsCount || 0,
      pendingReports: reportsCount || 0
    })
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">权限不足</h1>
          <p className="text-gray-600">你没有访问管理后台的权限</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      link: '/admin/users'
    },
    {
      title: '活跃课程',
      value: stats.activeCourses,
      icon: BookOpen,
      color: 'from-purple-400 to-purple-600',
      link: '/admin/courses'
    },
    {
      title: '作品总数',
      value: stats.totalProjects,
      icon: Award,
      color: 'from-green-400 to-green-600',
      link: '/admin/projects'
    },
    {
      title: '待处理举报',
      value: stats.pendingReports,
      icon: AlertTriangle,
      color: 'from-red-400 to-red-600',
      link: '/admin/reports'
    }
  ]

  const quickActions = [
    {
      title: '用户管理',
      description: '查看和管理用户账号',
      icon: Users,
      link: '/admin/users',
      color: 'blue'
    },
    {
      title: '课程管理',
      description: '创建和编辑课程内容',
      icon: BookOpen,
      link: '/admin/courses',
      color: 'purple'
    },
    {
      title: '作品审核',
      description: '审核和管理用户作品',
      icon: Award,
      link: '/admin/projects',
      color: 'green'
    },
    {
      title: '举报处理',
      description: '处理用户举报和投诉',
      icon: AlertTriangle,
      link: '/admin/reports',
      color: 'red'
    },
    {
      title: '数据统计',
      description: '查看平台数据和分析',
      icon: TrendingUp,
      link: '/admin/analytics',
      color: 'orange'
    },
    {
      title: '系统设置',
      description: '配置平台参数和功能',
      icon: Settings,
      link: '/admin/settings',
      color: 'gray'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">管理后台</h1>
          <p className="text-gray-600">
            欢迎回来, {profile.display_name || profile.username}!
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link key={index} href={card.link}>
                <div className="group cursor-pointer overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-600">
                    {card.title}
                  </h3>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 快捷操作 */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">快捷操作</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.link}>
                  <div className="group cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${action.color}-100 text-${action.color}-600`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="font-semibold text-gray-900">
                        {action.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

