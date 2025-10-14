/**
 * 关卡学习页面
 * 用户在这里完成编程任务
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { useUserStore } from '@/stores/user-store'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { PreviewPane } from '@/components/editor/PreviewPane'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Play,
  Save,
  Lightbulb,
  CheckCircle,
  Send
} from 'lucide-react'
import Link from 'next/link'

type LessonContent = {
  type: 'coding' | 'quiz' | 'project'
  instructions: string
  starter_code: {
    html: string
    css: string
    js: string
  }
  validation_rules?: any[]
  hints?: string[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const { toast } = useToast()
  const updateXP = useUserStore(state => state.updateXP)
  const updateCoins = useUserStore(state => state.updateCoins)

  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  const [htmlCode, setHtmlCode] = useState('')
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')

  useEffect(() => {
    if (profile && lessonId) {
      loadLessonData()
    }
  }, [profile, lessonId])

  const loadLessonData = async () => {
    const supabase = createClient()

    // 获取关卡信息
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*, courses(*)')
      .eq('id', lessonId)
      .single()

    if (!lessonData) {
      router.push('/learn')
      return
    }

    setLesson(lessonData)
    setCourse(lessonData.courses)

    // 加载起始代码
    const content = lessonData.content as LessonContent
    setHtmlCode(content.starter_code?.html || '')
    setCssCode(content.starter_code?.css || '')
    setJsCode(content.starter_code?.js || '')

    // 检查是否有已保存的进度
    if (profile) {
      const { data: progress } = await supabase
        .from('user_progress')
        .select('code_snapshot')
        .eq('user_id', profile.id)
        .eq('lesson_id', lessonId)
        .single()

      if (progress?.code_snapshot) {
        const snapshot = progress.code_snapshot as any
        setHtmlCode(snapshot.html || content.starter_code?.html || '')
        setCssCode(snapshot.css || content.starter_code?.css || '')
        setJsCode(snapshot.js || content.starter_code?.js || '')
      }
    }

    setLoading(false)
  }

  const handleSaveProgress = async () => {
    if (!profile) return

    const supabase = createClient()

    const { error } = await supabase.from('user_progress').upsert({
      user_id: profile.id,
      lesson_id: lessonId,
      status: 'in_progress',
      code_snapshot: {
        html: htmlCode,
        css: cssCode,
        js: jsCode
      },
      updated_at: new Date().toISOString()
    })

    if (error) {
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive'
      })
    } else {
      toast({
        title: '保存成功',
        description: '你的进度已保存'
      })
    }
  }

  const handleSubmit = async () => {
    if (!profile || !lesson) return

    setSubmitting(true)

    try {
      // 调用AI评分API
      const response = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          instructions: (lesson.content as LessonContent).instructions,
          validationRules: (lesson.content as LessonContent).validation_rules
        })
      })

      const result = await response.json()

      if (result.score >= 60) {
        // 通过关卡
        const supabase = createClient()

        // 更新用户进度
        await supabase.from('user_progress').upsert({
          user_id: profile.id,
          lesson_id: lessonId,
          status: 'completed',
          score: result.score,
          code_snapshot: {
            html: htmlCode,
            css: cssCode,
            js: jsCode
          },
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

        // 更新用户XP和金币
        const newXP = profile.xp + lesson.xp_reward
        const newCoins = profile.coins + lesson.coin_reward

        await supabase
          .from('users')
          .update({
            xp: newXP,
            coins: newCoins
          })
          .eq('id', profile.id)

        updateXP(newXP)
        updateCoins(newCoins)

        toast({
          title: '🎉 恭喜通过!',
          description: `获得 ${lesson.xp_reward} XP 和 ${lesson.coin_reward} 金币!`
        })

        // 延迟跳转回课程页面
        setTimeout(() => {
          router.push(`/learn/${course.id}`)
        }, 2000)
      } else {
        // 未通过
        toast({
          title: '还需要改进',
          description: result.feedback || '再试一次吧!',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: '提交失败',
        description: '请稍后重试',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleShowHint = () => {
    setShowHints(true)
    const content = lesson.content as LessonContent
    if (content.hints && currentHintIndex < content.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  if (loading || !lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const content = lesson.content as LessonContent

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/learn/${course.id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回课程
            </Button>
          </Link>

          <div className="h-6 w-px bg-gray-300"></div>

          <div>
            <h2 className="font-semibold text-gray-900">{lesson.title}</h2>
            <p className="text-xs text-gray-600">{course.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowHint}
            className="gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            提示
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveProgress}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            保存
          </Button>

          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <>提交中...</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                提交
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧任务说明 */}
        <div className="w-80 overflow-y-auto border-r bg-white p-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">任务说明</h3>
          
          <div className="prose prose-sm mb-6 text-gray-700 whitespace-pre-wrap">
            {content.instructions}
          </div>

          {/* 提示区域 */}
          {showHints && content.hints && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-yellow-800">
                <Lightbulb className="h-4 w-4" />
                <span className="font-semibold">提示</span>
              </div>
              
              <ul className="space-y-2 text-sm text-yellow-900">
                {content.hints.slice(0, currentHintIndex + 1).map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>

              {currentHintIndex < content.hints.length - 1 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleShowHint}
                  className="mt-2 px-0 text-yellow-700"
                >
                  查看下一个提示 →
                </Button>
              )}
            </div>
          )}

          {/* 奖励信息 */}
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">完成奖励</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div>⚡ +{lesson.xp_reward} XP</div>
              <div>🪙 +{lesson.coin_reward} 金币</div>
            </div>
          </div>
        </div>

        {/* 右侧代码编辑器和预览 */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1">
              <CodeEditor
                html={htmlCode}
                css={cssCode}
                js={jsCode}
                onHtmlChange={setHtmlCode}
                onCssChange={setCssCode}
                onJsChange={setJsCode}
              />
            </div>

            <div className="w-1/2 border-l">
              <PreviewPane html={htmlCode} css={cssCode} js={jsCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

