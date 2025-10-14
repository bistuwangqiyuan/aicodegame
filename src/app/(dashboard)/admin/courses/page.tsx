/**
 * 课程管理页面
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

type Course = {
  id: string
  title: string
  description: string
  level: number
  order: number
  is_published: boolean
  lessonCount: number
  created_at: string
}

export default function AdminCoursesPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role !== 'admin' && profile.role !== 'teacher') {
        router.push('/')
        return
      }

      loadCourses()
    }
  }, [loading, profile])

  const loadCourses = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons(count)
      `)
      .order('level')
      .order('order')

    if (data) {
      const formattedCourses: Course[] = data.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        level: c.level,
        order: c.order,
        is_published: c.is_published,
        lessonCount: (c.lessons as any)?.[0]?.count || 0,
        created_at: c.created_at
      }))

      setCourses(formattedCourses)
    }

    setLoadingCourses(false)
  }

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    const supabase = createClient()

    const { error } = await supabase
      .from('courses')
      .update({ is_published: !currentStatus })
      .eq('id', courseId)

    if (error) {
      toast({
        title: '操作失败',
        description: error.message,
        variant: 'destructive'
      })
    } else {
      toast({
        title: !currentStatus ? '课程已发布' : '课程已下架'
      })
      loadCourses()
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('确定要删除这个课程吗? 所有关卡也会被删除。')) return

    const supabase = createClient()

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive'
      })
    } else {
      toast({ title: '课程已删除' })
      loadCourses()
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">课程管理</h1>
            <p className="text-gray-600">创建和管理课程内容</p>
          </div>

          <Link href="/admin/courses/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建课程
            </Button>
          </Link>
        </div>

        {/* 课程列表 */}
        {loadingCourses ? (
          <div className="py-12 text-center">
            <div className="loading-spinner mx-auto"></div>
          </div>
        ) : courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map(course => (
              <div
                key={course.id}
                className="flex items-center gap-6 rounded-xl border bg-white p-6 shadow-sm"
              >
                {/* 课程信息 */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      Level {course.level}
                    </span>

                    {course.is_published ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        <Eye className="h-3 w-3" />
                        已发布
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        <EyeOff className="h-3 w-3" />
                        草稿
                      </span>
                    )}
                  </div>

                  <h3 className="mb-1 text-xl font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mb-2 text-gray-600">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessonCount} 关卡</span>
                    </div>
                    <div>
                      创建于 {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(course.id, course.is_published)}
                    className="gap-2"
                  >
                    {course.is_published ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        下架
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        发布
                      </>
                    )}
                  </Button>

                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      编辑
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="gap-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-lg">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              还没有课程
            </h3>
            <p className="mb-4 text-gray-600">创建你的第一个课程吧!</p>
            <Link href="/admin/courses/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                创建课程
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

