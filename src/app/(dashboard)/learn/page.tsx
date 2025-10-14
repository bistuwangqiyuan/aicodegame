/**
 * 学习中心页面
 * 显示课程地图和学习进度
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { XPBar } from '@/components/gamification/XPBar'
import {
  BookOpen,
  Lock,
  CheckCircle,
  PlayCircle,
  Award,
  TrendingUp
} from 'lucide-react'
import { calculateLevel } from '@/lib/utils'

type Course = {
  id: string
  title: string
  description: string
  level: number
  order: number
  lessonCount: number
  completedCount: number
  totalXP: number
}

export default function LearnPage() {
  const { profile, loading } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (profile) {
      loadCourses()
    }
  }, [profile])

  const loadCourses = async () => {
    const supabase = createClient()

    // 获取所有已发布的课程
    const { data: coursesData } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        level,
        order,
        lessons:lessons(count)
      `)
      .eq('is_published', true)
      .order('level')
      .order('order')

    if (coursesData && profile) {
      // 为每个课程获取完成情况
      const coursesWithProgress = await Promise.all(
        coursesData.map(async course => {
          // 获取课程的所有关卡
          const { data: lessons } = await supabase
            .from('lessons')
            .select('id, xp_reward')
            .eq('course_id', course.id)

          const lessonIds = lessons?.map(l => l.id) || []
          const totalXP = lessons?.reduce((sum, l) => sum + l.xp_reward, 0) || 0

          // 获取用户完成的关卡数
          const { count: completedCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .in('lesson_id', lessonIds)
            .eq('status', 'completed')

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            order: course.order,
            lessonCount: lessons?.length || 0,
            completedCount: completedCount || 0,
            totalXP
          }
        })
      )

      setCourses(coursesWithProgress)
    }

    setLoadingCourses(false)
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const levelInfo = calculateLevel(profile.xp)

  // 课程图标映射
  const getLevelIcon = (level: number) => {
    const icons = ['📝', '🎨', '⚡', '🔧', '🚀']
    return icons[level - 1] || '📚'
  }

  // 课程颜色映射
  const getLevelColor = (level: number) => {
    const colors = [
      'from-orange-400 to-red-400',
      'from-purple-400 to-pink-400',
      'from-yellow-400 to-orange-400',
      'from-green-400 to-teal-400',
      'from-blue-400 to-cyan-400'
    ]
    return colors[level - 1] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 头部 - 用户进度 */}
        <div className="mb-8 rounded-2xl border bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">学习中心</h1>
              <p className="text-gray-600">选择课程,开始你的编程之旅!</p>
            </div>

            <div className="text-right">
              <div className="mb-1 text-sm text-gray-600">你的进度</div>
              <div className="text-2xl font-bold text-blue-600">
                Level {profile.level}
              </div>
            </div>
          </div>

          <XPBar
            currentXP={levelInfo.currentXP}
            nextLevelXP={levelInfo.nextLevelXP}
            level={profile.level}
            size="lg"
          />
        </div>

        {/* 学习路径提示 */}
        <div className="mb-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">学习路径建议</h3>
              <p className="mt-1 text-sm text-blue-700">
                建议按照 Level 1 → Level 5 的顺序学习,每个 Level
                完成后自动解锁下一个。完成关卡可以获得 XP 和金币奖励!
              </p>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        {loadingCourses ? (
          <div className="py-12 text-center">
            <div className="loading-spinner mx-auto"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="space-y-6">
            {courses.map((course, index) => {
              const progress = course.lessonCount > 0
                ? (course.completedCount / course.lessonCount) * 100
                : 0
              const isCompleted = course.completedCount === course.lessonCount && course.lessonCount > 0
              const isLocked = index > 0 && courses[index - 1].completedCount < courses[index - 1].lessonCount
              const isInProgress = course.completedCount > 0 && !isCompleted

              return (
                <div
                  key={course.id}
                  className={`group relative overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all ${
                    isLocked
                      ? 'border-gray-300 opacity-60'
                      : isCompleted
                        ? 'border-green-500 hover:shadow-xl'
                        : 'border-blue-300 hover:scale-[1.02] hover:shadow-xl'
                  }`}
                >
                  {/* 背景装饰 */}
                  <div
                    className={`absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l ${getLevelColor(course.level)} opacity-10`}
                  ></div>

                  <div className="relative p-8">
                    <div className="flex items-start gap-6">
                      {/* 课程图标 */}
                      <div
                        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${getLevelColor(course.level)} text-4xl shadow-lg`}
                      >
                        {getLevelIcon(course.level)}
                      </div>

                      {/* 课程信息 */}
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                            Level {course.level}
                          </span>

                          {isCompleted && (
                            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              已完成
                            </span>
                          )}

                          {isInProgress && (
                            <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                              <PlayCircle className="h-4 w-4" />
                              进行中
                            </span>
                          )}

                          {isLocked && (
                            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                              <Lock className="h-4 w-4" />
                              未解锁
                            </span>
                          )}
                        </div>

                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                          {course.title}
                        </h2>

                        <p className="mb-4 text-gray-600">{course.description}</p>

                        {/* 进度条 */}
                        <div className="mb-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              进度: {course.completedCount} / {course.lessonCount} 关卡
                            </span>
                            <span className="font-medium text-blue-600">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lessonCount} 关卡</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span>{course.totalXP} XP</span>
                            </div>
                          </div>

                          <Link href={isLocked ? '#' : `/learn/${course.id}`}>
                            <Button
                              disabled={isLocked}
                              className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {isLocked
                                ? '完成上一个课程以解锁'
                                : isCompleted
                                  ? '复习课程'
                                  : isInProgress
                                    ? '继续学习'
                                    : '开始学习'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-lg">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              暂无课程
            </h3>
            <p className="text-gray-600">课程内容正在准备中,敬请期待!</p>
          </div>
        )}
      </div>
    </div>
  )
}

