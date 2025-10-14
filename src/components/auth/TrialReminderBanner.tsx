/**
 * 试用期提醒横幅组件
 * 在页面顶部显示试用期剩余时间提醒
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { shouldShowTrialReminder, getTrialReminderMessage } from '@/lib/auth/guest'

export function TrialReminderBanner() {
  const { isGuest, isTrialValid, trialDaysRemaining } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  // 不显示条件：非游客、已关闭、不在提醒时间点
  if (!isGuest || dismissed || !isTrialValid) {
    return null
  }

  if (!shouldShowTrialReminder(trialDaysRemaining)) {
    return null
  }

  const message = getTrialReminderMessage(trialDaysRemaining)

  // 根据剩余天数决定样式
  const getBannerStyle = () => {
    if (trialDaysRemaining === 0) {
      return 'bg-red-500 text-white'
    } else if (trialDaysRemaining <= 1) {
      return 'bg-orange-500 text-white'
    } else if (trialDaysRemaining <= 3) {
      return 'bg-yellow-500 text-black'
    }
    return 'bg-blue-500 text-white'
  }

  return (
    <div className={`relative ${getBannerStyle()}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{message}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/register">
              <Button
                size="sm"
                variant={trialDaysRemaining === 0 ? 'secondary' : 'outline'}
                className={
                  trialDaysRemaining === 0
                    ? 'bg-white text-red-600 hover:bg-gray-100'
                    : 'border-white text-white hover:bg-white/10'
                }
              >
                <Sparkles className="mr-2 h-4 w-4" />
                立即注册
              </Button>
            </Link>

            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 rounded p-1 hover:bg-white/10"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

