/**
 * AI代码评分API路由
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
    const { code, language, requirements } = await request.json()

    if (!code || !language || !requirements) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 调用DeepSeek API
    const result = await deepseek.gradeCode(code, language, requirements)

    // 如果评分>80,奖励XP
    if (result.score >= 80) {
      const xpReward = Math.floor(result.score / 10) * 5 // 根据分数计算XP
      
      await supabase
        .from('users')
        .update({ xp: supabase.raw('xp + ?', [xpReward]) })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    console.error('AI评分失败:', error)
    return NextResponse.json(
      { error: error.message || 'AI服务暂时不可用' },
      { status: 500 }
    )
  }
}

