/**
 * Dashboard布局
 * 包含Header、导航和受保护路由
 */

'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { TrialReminderBanner } from '@/components/auth/TrialReminderBanner'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <TrialReminderBanner />
        
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
