/**
 * OAuth回调路由
 * 处理第三方OAuth登录后的回调
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 登录成功后重定向到学习中心
  return NextResponse.redirect(new URL('/learn', requestUrl.origin))
}

