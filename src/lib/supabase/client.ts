/**
 * Supabase浏览器端客户端
 * 用于在客户端组件中访问Supabase
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!url || !key) {
      throw new Error('Supabase配置缺失')
    }
    
    return createBrowserClient<Database>(url, key)
  } catch (error) {
    console.error('Supabase客户端初始化失败:', error)
    // 返回基础功能
    throw error
  }
}

