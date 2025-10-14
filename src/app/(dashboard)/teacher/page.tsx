/**
 * 教师工作台
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  PlusCircle
} from 'lucide-react'
import Link from 'next/link'

type Stats = {
  myCourses: number
  totalStudents: number
  completedLessons: number
  averageScore: number
}

export default function TeacherPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    myCourses: 0,
    totalStudents: 0,
    completedLessons: 0,
    averageScore: 0
  })

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role !== 'teacher' && profile.role !== 'admin') {
        router.push('/')
        return
      }

      loadStats()
    }
  }, [loading, profile])

  const loadStats = async () => {
    if (!profile) return

    const supabase = createClient()

    // 获取我创建的课程数
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', profile.id)

    // 获取学习我的课程的学生数(简化统计)
    const { count: studentsCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    // 获取完成的关卡数
    const { count: lessonsCount } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // 获取平均分数
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('score')
      .eq('status', 'completed')
      .not('score', 'is', null)

    const avgScore = progressData && progressData.length > 0
      ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length
      : 0

    setStats({
      myCourses: coursesCount || 0,
      totalStudents: studentsCount || 0,
      completedLessons: lessonsCount || 0,
      averageScore: Math.round(avgScore)
    })
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (profile.role !== 'teacher' && profile.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">权限不足</h1>
          <p className="text-gray-600">你没有访问教师工作台的权限</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: '我的课程',
      value: stats.myCourses,
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: '学生总数',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: '完成关卡',
      value: stats.completedLessons,
      icon: Award,
      color: 'from-green-400 to-green-600'
    },
    {
      title: '平均分数',
      value: `${stats.averageScore}分`,
      icon: TrendingUp,
      color: 'from-orange-400 to-orange-600'
    }
  ]

  const quickActions = [
    {
      title: '创建新课程',
      description: '设计全新的学习内容',
      link: '/admin/courses/new',
      icon: PlusCircle,
      color: 'blue'
    },
    {
      title: '管理课程',
      description: '编辑和管理现有课程',
      link: '/admin/courses',
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: '学生进度',
      description: '查看学生学习情况',
      link: '/teacher/students',
      icon: Users,
      color: 'green'
    },
    {
      title: '数据分析',
      description: '查看教学数据和统计',
      link: '/teacher/analytics',
      icon: TrendingUp,
      color: 'orange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">教师工作台</h1>
          <p className="text-gray-600">
            欢迎, {profile.display_name || profile.username} 老师!
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border bg-white p-6 shadow-sm"
              >
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
            )
          })}
        </div>

        {/* 快捷操作 */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">快捷操作</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.link}>
                  <div className="group cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${action.color}-100 text-${action.color}-600`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
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

