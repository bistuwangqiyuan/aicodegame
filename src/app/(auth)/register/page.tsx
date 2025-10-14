/**
 * 注册页面
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, Mail, Lock, User, Chrome, Github, Check, X } from 'lucide-react'
import { isValidEmail, getPasswordStrength } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const { signUpWithEmail, signInWithOAuth } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const passwordStrength = getPasswordStrength(formData.password)

  const passwordRequirements = [
    { text: '至少8个字符', met: formData.password.length >= 8 },
    { text: '包含大小写字母', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
    { text: '包含数字', met: /\d/.test(formData.password) },
    { text: '包含特殊字符', met: /[^a-zA-Z0-9]/.test(formData.password) }
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: '请填写完整',
        description: '用户名、邮箱和密码不能为空',
        variant: 'destructive'
      })
      return
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: '邮箱格式错误',
        description: '请输入有效的邮箱地址',
        variant: 'destructive'
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: '密码过短',
        description: '密码至少需要8个字符',
        variant: 'destructive'
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '两次输入的密码不一致',
        variant: 'destructive'
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: '请同意条款',
        description: '请阅读并同意服务条款和隐私政策',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.username,
        formData.displayName || formData.username
      )

      toast({
        title: '注册成功!',
        description: '请查收验证邮件以激活账号'
      })

      // 跳转到验证邮件提示页
      setTimeout(() => {
        router.push('/verify-email')
      }, 2000)
    } catch (error: any) {
      console.error('注册失败:', error)

      let errorMessage = '注册失败,请重试'
      if (error.message.includes('already registered')) {
        errorMessage = '该邮箱已被注册'
      } else if (error.message.includes('invalid')) {
        errorMessage = '输入信息无效'
      }

      toast({
        title: '注册失败',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthRegister = async (provider: 'google' | 'github') => {
    setIsLoading(true)

    try {
      await signInWithOAuth(provider)
    } catch (error: any) {
      console.error('OAuth注册失败:', error)

      toast({
        title: 'OAuth注册失败',
        description: error.message,
        variant: 'destructive'
      })

      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-blue-600">
            <UserPlus className="h-8 w-8" />
            <span>GameCode Lab</span>
          </Link>
          <p className="mt-2 text-gray-600">创建账号,开始你的编程之旅</p>
        </div>

        {/* 注册卡片 */}
        <div className="rounded-2xl border bg-white p-8 shadow-lg">
          {/* OAuth注册 */}
          <div className="mb-6 space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthRegister('google')}
              disabled={isLoading}
            >
              <Chrome className="h-5 w-5" />
              <span>使用 Google 注册</span>
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => handleOAuthRegister('github')}
              disabled={isLoading}
            >
              <Github className="h-5 w-5" />
              <span>使用 GitHub 注册</span>
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">或使用邮箱注册</span>
            </div>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                显示名称 (可选)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>

              {/* 密码强度指示器 */}
              {formData.password && (
                <div className="mt-2">
                  <div className="mb-1 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1 text-xs">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  我已阅读并同意{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    服务条款
                  </Link>{' '}
                  和{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    隐私政策
                  </Link>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? '注册中...' : '创建账号'}
            </Button>
          </form>

          {/* 登录链接 */}
          <p className="mt-6 text-center text-sm text-gray-600">
            已有账号?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              立即登录
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
      </div>
    </div>
  )
}

