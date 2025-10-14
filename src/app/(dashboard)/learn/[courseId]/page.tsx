/**
 * 课程详情页面
 * 显示课程的所有关卡
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Clock,
  Award,
  Zap
} from 'lucide-react'

type Lesson = {
  id: string
  title: string
  description: string
  order: number
  xp_reward: number
  coin_reward: number
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'locked' | 'in_progress' | 'completed'
  score?: number
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile && courseId) {
      loadCourseData()
    }
  }, [profile, courseId])

  const loadCourseData = async () => {
    const supabase = createClient()

    // 获取课程信息
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (!courseData) {
      router.push('/learn')
      return
    }

    setCourse(courseData)

    // 获取所有关卡
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order')

    if (lessonsData && profile) {
      // 获取用户进度
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', profile.id)
        .in('lesson_id', lessonsData.map(l => l.id))

      const progressMap = new Map(
        progressData?.map(p => [p.lesson_id, p]) || []
      )

      // 合并关卡和进度数据
      const lessonsWithProgress = lessonsData.map((lesson, index) => {
        const progress = progressMap.get(lesson.id)
        
        // 第一个关卡默认解锁
        let status: 'locked' | 'in_progress' | 'completed' = 'locked'
        
        if (index === 0) {
          status = progress?.status || 'in_progress'
        } else {
          // 检查上一个关卡是否完成
          const prevProgress = progressMap.get(lessonsData[index - 1].id)
          if (prevProgress?.status === 'completed') {
            status = progress?.status || 'in_progress'
          }
        }

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          xp_reward: lesson.xp_reward,
          coin_reward: lesson.coin_reward,
          difficulty: lesson.difficulty,
          status,
          score: progress?.score
        }
      })

      setLessons(lessonsWithProgress)
    }

    setLoading(false)
  }

  if (loading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const completedCount = lessons.filter(l => l.status === 'completed').length
  const progress = (completedCount / lessons.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* 返回按钮 */}
        <Link href="/learn">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回学习中心
          </Button>
        </Link>

        {/* 课程头部 */}
        <div className="mb-8 rounded-2xl border bg-white p-8 shadow-lg">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                Level {course.level}
              </span>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {course.title}
              </h1>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </div>

          {/* 进度 */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                完成进度: {completedCount} / {lessons.length} 关卡
              </span>
              <span className="font-medium text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 关卡列表 */}
        <div className="space-y-4">
          {lessons.map((lesson, index) => {
            const isLocked = lesson.status === 'locked'
            const isCompleted = lesson.status === 'completed'

            return (
              <div
                key={lesson.id}
                className={`group rounded-xl border-2 bg-white p-6 shadow-sm transition-all ${
                  isLocked
                    ? 'border-gray-200 opacity-60'
                    : isCompleted
                      ? 'border-green-300 hover:shadow-md'
                      : 'border-blue-300 hover:scale-[1.02] hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* 关卡编号 */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isLocked
                          ? 'bg-gray-200 text-gray-500'
                          : 'bg-blue-500 text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : isLocked ? (
                      <Lock className="h-8 w-8" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* 关卡信息 */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {lesson.title}
                      </h3>
                      
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase ${getDifficultyColor(lesson.difficulty)}`}
                      >
                        {lesson.difficulty}
                      </span>

                      {isCompleted && lesson.score && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                          {lesson.score}分
                        </span>
                      )}
                    </div>

                    <p className="mb-3 text-gray-600">{lesson.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span>+{lesson.xp_reward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-orange-500" />
                        <span>+{lesson.coin_reward} 金币</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>约10分钟</span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <Link href={isLocked ? '#' : `/lesson/${lesson.id}`}>
                    <Button
                      disabled={isLocked}
                      variant={isCompleted ? 'outline' : 'default'}
                      className="gap-2"
                    >
                      {isLocked ? (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>未解锁</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <Play className="h-4 w-4" />
                          <span>重做</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          <span>开始</span>
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

