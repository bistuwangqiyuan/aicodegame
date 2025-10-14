/**
 * 作品详情页面
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Code,
  Edit,
  Trash2,
  Send
} from 'lucide-react'

type Comment = {
  id: string
  content: string
  created_at: string
  user: {
    display_name: string
    avatar_url?: string
    level: number
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const { toast } = useToast()

  const projectId = params.projectId as string

  const [project, setProject] = useState<any>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (projectId) {
      loadProjectData()
      incrementViewCount()
    }
  }, [projectId, profile])

  const loadProjectData = async () => {
    const supabase = createClient()

    // 获取作品信息
    const { data: projectData } = await supabase
      .from('projects')
      .select(`
        *,
        users!projects_user_id_fkey(id, display_name, avatar_url, level)
      `)
      .eq('id', projectId)
      .single()

    if (!projectData) {
      router.push('/community')
      return
    }

    setProject(projectData)

    // 获取点赞数
    const { count } = await supabase
      .from('project_likes')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)

    setLikeCount(count || 0)

    // 获取当前用户的点赞和收藏状态
    if (profile) {
      const { data: like } = await supabase
        .from('project_likes')
        .select('id')
        .eq('user_id', profile.id)
        .eq('project_id', projectId)
        .single()

      setIsLiked(!!like)

      const { data: bookmark } = await supabase
        .from('user_bookmarks')
        .select('id')
        .eq('user_id', profile.id)
        .eq('project_id', projectId)
        .single()

      setIsBookmarked(!!bookmark)
    }

    // 获取评论
    const { data: commentsData } = await supabase
      .from('comments')
      .select(`
        *,
        users!comments_user_id_fkey(display_name, avatar_url, level)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (commentsData) {
      const formattedComments: Comment[] = commentsData.map(c => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user: {
          display_name: c.users.display_name || 'Anonymous',
          avatar_url: c.users.avatar_url,
          level: c.users.level
        }
      }))
      setComments(formattedComments)
    }

    setLoading(false)
  }

  const incrementViewCount = async () => {
    const supabase = createClient()
    await supabase.rpc('increment_view_count', { project_id: projectId })
  }

  const handleLike = async () => {
    if (!profile) {
      toast({
        title: '请先登录',
        variant: 'destructive'
      })
      return
    }

    const supabase = createClient()

    if (isLiked) {
      await supabase
        .from('project_likes')
        .delete()
        .eq('user_id', profile.id)
        .eq('project_id', projectId)

      setIsLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      await supabase.from('project_likes').insert({
        user_id: profile.id,
        project_id: projectId
      })

      setIsLiked(true)
      setLikeCount(likeCount + 1)
    }
  }

  const handleBookmark = async () => {
    if (!profile) {
      toast({
        title: '请先登录',
        variant: 'destructive'
      })
      return
    }

    const supabase = createClient()

    if (isBookmarked) {
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', profile.id)
        .eq('project_id', projectId)

      setIsBookmarked(false)
      toast({ title: '已取消收藏' })
    } else {
      await supabase.from('user_bookmarks').insert({
        user_id: profile.id,
        project_id: projectId
      })

      setIsBookmarked(true)
      toast({ title: '收藏成功!' })
    }
  }

  const handlePostComment = async () => {
    if (!profile) {
      toast({
        title: '请先登录',
        variant: 'destructive'
      })
      return
    }

    if (!newComment.trim()) return

    const supabase = createClient()

    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        user_id: profile.id,
        content: newComment.trim()
      })
      .select(`
        *,
        users!comments_user_id_fkey(display_name, avatar_url, level)
      `)
      .single()

    if (error) {
      toast({
        title: '评论失败',
        variant: 'destructive'
      })
    } else {
      setNewComment('')
      loadProjectData()
      toast({ title: '评论成功!' })
    }
  }

  const handleDeleteProject = async () => {
    if (!profile || !project || project.user_id !== profile.id) return

    if (!confirm('确定要删除这个作品吗?')) return

    const supabase = createClient()

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      toast({
        title: '删除失败',
        variant: 'destructive'
      })
    } else {
      toast({ title: '作品已删除' })
      router.push('/community')
    }
  }

  if (loading || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const isOwner = profile?.id === project.user_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* 返回按钮 */}
        <Link href="/community">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回社区
          </Button>
        </Link>

        {/* 作品详情卡片 */}
        <div className="mb-6 rounded-2xl border bg-white p-8 shadow-lg">
          {/* 头部信息 */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              <p className="text-gray-600">{project.description}</p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Link href={`/projects/${projectId}/edit`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    编辑
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteProject}
                  className="gap-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  删除
                </Button>
              </div>
            )}
          </div>

          {/* 作者信息 */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-lg font-semibold text-white">
              {project.users.avatar_url ? (
                <img
                  src={project.users.avatar_url}
                  alt={project.users.display_name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                project.users.display_name[0]
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {project.users.display_name}
              </div>
              <div className="text-sm text-gray-600">
                Level {project.users.level}
              </div>
            </div>
          </div>

          {/* 作品预览 */}
          <div className="mb-6 overflow-hidden rounded-lg border">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>${project.code_snapshot?.css || ''}</style>
                  </head>
                  <body>
                    ${project.code_snapshot?.html || ''}
                    <script>${project.code_snapshot?.js || ''}</script>
                  </body>
                </html>
              `}
              className="h-[500px] w-full bg-white"
              sandbox="allow-scripts"
            />
          </div>

          {/* 互动按钮 */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-3">
              <Button
                variant={isLiked ? 'default' : 'outline'}
                onClick={handleLike}
                className="gap-2"
              >
                <Heart className={isLiked ? 'fill-current' : ''} />
                <span>{likeCount}</span>
              </Button>

              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                onClick={handleBookmark}
                className="gap-2"
              >
                <Bookmark className={isBookmarked ? 'fill-current' : ''} />
                收藏
              </Button>

              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                分享
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="h-4 w-4" />
              <span>{project.view_count || 0} 次浏览</span>
            </div>
          </div>
        </div>

        {/* 评论区 */}
        <div id="comments" className="rounded-2xl border bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            评论 ({comments.length})
          </h2>

          {/* 发表评论 */}
          {profile && (
            <div className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的评论..."
                className="w-full rounded-lg border p-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  发表评论
                </Button>
              </div>
            </div>
          )}

          {/* 评论列表 */}
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 border-b pb-4 last:border-b-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-sm font-semibold text-white">
                  {comment.user.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      alt={comment.user.display_name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    comment.user.display_name[0]
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.user.display_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Lv{comment.user.level}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                还没有评论,来发表第一条吧!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

