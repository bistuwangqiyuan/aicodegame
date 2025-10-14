/**
 * 登录页面
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { LogIn, Mail, Lock, Chrome, Github } from 'lucide-react'
import { isValidEmail } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmail, signInWithOAuth } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!email || !password) {
      toast({
        title: '请填写完整',
        description: '邮箱和密码不能为空',
        variant: 'destructive'
      })
      return
    }

    if (!isValidEmail(email)) {
      toast({
        title: '邮箱格式错误',
        description: '请输入有效的邮箱地址',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      await signInWithEmail(email, password)

      toast({
        title: '登录成功!',
        description: '欢迎回来,正在跳转...'
      })

      // 跳转到学习中心
      setTimeout(() => {
        router.push('/learn')
      }, 1000)
    } catch (error: any) {
      console.error('登录失败:', error)

      toast({
        title: '登录失败',
        description: error.message || '邮箱或密码错误',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)

    try {
      await signInWithOAuth(provider)
      // OAuth会自动重定向,无需手动跳转
    } catch (error: any) {
      console.error('OAuth登录失败:', error)

      toast({
        title: 'OAuth登录失败',
        description: error.message,
        variant: 'destructive'
      })

      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-blue-600">
            <LogIn className="h-8 w-8" />
            <span>GameCode Lab</span>
          </Link>
          <p className="mt-2 text-gray-600">登录你的账号,继续学习之旅</p>
        </div>

        {/* 登录卡片 */}
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          {/* OAuth登录 */}
          <div className="mb-6 space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5" />
              <span>使用 Google 登录</span>
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
            >
              <Github className="h-5 w-5" />
              <span>使用 GitHub 登录</span>
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">或使用邮箱登录</span>
            </div>
          </div>

          {/* 邮箱登录表单 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">记住我</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700"
              >
                忘记密码?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          {/* 注册链接 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            还没有账号?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-700">
              立即注册
            </Link>
          </p>

          {/* 游客模式 */}
          <div className="mt-4 text-center">
            <Link
              href="/learn"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              继续以游客身份学习 →
            </Link>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="mt-6 text-center text-sm text-gray-500">
          登录即表示你同意我们的{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-700">
            服务条款
          </Link>{' '}
          和{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
            隐私政策
          </Link>
        </p>
      </div>
    </div>
  )
}

