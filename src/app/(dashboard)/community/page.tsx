/**
 * 社区作品展示页面
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Share2,
  Plus,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  thumbnail_url?: string
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  user: {
    id: string
    display_name: string
    avatar_url?: string
    level: number
  }
  is_liked: boolean
  is_bookmarked: boolean
}

export default function CommunityPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'trending' | 'latest' | 'featured'>('trending')

  useEffect(() => {
    loadProjects()
  }, [filter, profile])

  const loadProjects = async () => {
    const supabase = createClient()

    let query = supabase
      .from('projects')
      .select(`
        *,
        users!projects_user_id_fkey(id, display_name, avatar_url, level),
        project_likes(count)
      `)
      .eq('is_public', true)

    // 根据筛选条件排序
    if (filter === 'trending') {
      query = query.order('view_count', { ascending: false })
    } else if (filter === 'latest') {
      query = query.order('created_at', { ascending: false })
    } else if (filter === 'featured') {
      query = query.eq('is_featured', true).order('created_at', { ascending: false })
    }

    const { data, error } = await query.limit(20)

    if (data && !error) {
      // 获取当前用户的点赞和收藏状态
      let likedProjects = new Set<string>()
      let bookmarkedProjects = new Set<string>()

      if (profile) {
        const { data: likes } = await supabase
          .from('project_likes')
          .select('project_id')
          .eq('user_id', profile.id)

        const { data: bookmarks } = await supabase
          .from('user_bookmarks')
          .select('project_id')
          .eq('user_id', profile.id)

        likedProjects = new Set(likes?.map(l => l.project_id))
        bookmarkedProjects = new Set(bookmarks?.map(b => b.project_id))
      }

      // 格式化数据
      const formattedProjects: Project[] = data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        thumbnail_url: p.thumbnail_url,
        view_count: p.view_count || 0,
        like_count: (p.project_likes as any)?.[0]?.count || 0,
        comment_count: 0, // TODO: 添加评论计数
        created_at: p.created_at,
        user: {
          id: p.users.id,
          display_name: p.users.display_name || 'Anonymous',
          avatar_url: p.users.avatar_url,
          level: p.users.level
        },
        is_liked: likedProjects.has(p.id),
        is_bookmarked: bookmarkedProjects.has(p.id)
      }))

      setProjects(formattedProjects)
    }

    setLoading(false)
  }

  const handleLike = async (projectId: string) => {
    if (!profile) {
      toast({
        title: '请先登录',
        description: '登录后即可点赞作品',
        variant: 'destructive'
      })
      return
    }

    const supabase = createClient()
    const project = projects.find(p => p.id === projectId)

    if (project?.is_liked) {
      // 取消点赞
      await supabase
        .from('project_likes')
        .delete()
        .eq('user_id', profile.id)
        .eq('project_id', projectId)
    } else {
      // 添加点赞
      await supabase.from('project_likes').insert({
        user_id: profile.id,
        project_id: projectId
      })
    }

    // 重新加载数据
    loadProjects()
  }

  const handleBookmark = async (projectId: string) => {
    if (!profile) {
      toast({
        title: '请先登录',
        description: '登录后即可收藏作品',
        variant: 'destructive'
      })
      return
    }

    const supabase = createClient()
    const project = projects.find(p => p.id === projectId)

    if (project?.is_bookmarked) {
      // 取消收藏
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('project_id', projectId)

      toast({ title: '已取消收藏' })
    } else {
      // 添加收藏
      await supabase.from('user_bookmarks').insert({
        user_id: profile.id,
        project_id: projectId
      })

      toast({ title: '收藏成功!' })
    }

    // 重新加载数据
    loadProjects()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* 头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">作品展示</h1>
            <p className="text-gray-600">发现优秀作品,获取创作灵感</p>
          </div>

          <Link href="/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              发布作品
            </Button>
          </Link>
        </div>

        {/* 筛选标签 */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'trending' ? 'default' : 'outline'}
            onClick={() => setFilter('trending')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            热门
          </Button>
          <Button
            variant={filter === 'latest' ? 'default' : 'outline'}
            onClick={() => setFilter('latest')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            最新
          </Button>
          <Button
            variant={filter === 'featured' ? 'default' : 'outline'}
            onClick={() => setFilter('featured')}
            className="gap-2"
          >
            <Award className="h-4 w-4" />
            精选
          </Button>
        </div>

        {/* 作品网格 */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="loading-spinner mx-auto"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <div
                key={project.id}
                className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg"
              >
                {/* 作品缩略图 */}
                <Link href={`/projects/${project.id}`}>
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🎨
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {/* 作品标题 */}
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {project.description}
                  </p>

                  {/* 作者信息 */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-sm font-semibold text-white">
                      {project.user.avatar_url ? (
                        <img
                          src={project.user.avatar_url}
                          alt={project.user.display_name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        project.user.display_name[0]
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {project.user.display_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Level {project.user.level}
                      </div>
                    </div>
                  </div>

                  {/* 互动按钮 */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleLike(project.id)}
                        className={`flex items-center gap-1 transition-colors hover:text-red-500 ${
                          project.is_liked ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${project.is_liked ? 'fill-current' : ''}`}
                        />
                        <span>{project.like_count}</span>
                      </button>

                      <Link
                        href={`/projects/${project.id}#comments`}
                        className="flex items-center gap-1 hover:text-blue-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{project.comment_count}</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{project.view_count}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleBookmark(project.id)}
                        className={`rounded p-1.5 transition-colors hover:bg-gray-100 ${
                          project.is_bookmarked ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            project.is_bookmarked ? 'fill-current' : ''
                          }`}
                        />
                      </button>

                      <button className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 text-6xl">🎨</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              暂无作品
            </h3>
            <p className="text-gray-600">成为第一个发布作品的人吧!</p>
          </div>
        )}
      </div>
    </div>
  )
}

