/**
 * AI聊天API路由
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
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      )
    }

    // TODO: 实现API限流检查
    // 检查用户的API调用次数

    // 调用DeepSeek API
    const response = await deepseek.chatWithMentor(message, history || [])

    return NextResponse.json({
      success: true,
      message: response
    })
  } catch (error: any) {
    console.error('AI聊天失败:', error)
    return NextResponse.json(
      { error: error.message || 'AI服务暂时不可用' },
      { status: 500 }
    )
  }
}

