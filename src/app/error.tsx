'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('应用错误:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-4 text-6xl">⚠️</div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">出错了</h2>
        <p className="mb-6 text-gray-600">
          抱歉，应用遇到了一些问题。请刷新页面重试。
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            重试
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}

