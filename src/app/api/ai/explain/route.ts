/**
 * AI代码讲解API路由
 */

import { NextResponse } from 'next/server'
import { deepseek } from '@/lib/deepseek/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    // 验证用户身份
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 获取请求数据
    const { code, language, context } = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 调用DeepSeek API
    const explanation = await deepseek.explainCode(code, language, context)

    return NextResponse.json({
      success: true,
      explanation
    })
  } catch (error: any) {
    console.error('AI讲解失败:', error)
    return NextResponse.json(
      { error: error.message || 'AI服务暂时不可用' },
      { status: 500 }
    )
  }
}

