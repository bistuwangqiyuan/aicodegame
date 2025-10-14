/**
 * Supabase服务端客户端
 * 用于在服务端组件和API路由中访问Supabase
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!url || !key) {
      throw new Error('Supabase配置缺失')
    }
    
    const cookieStore = await cookies()

    return createServerClient<Database>(
      url,
      key,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // 服务端组件中调用set会失败,忽略错误
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // 服务端组件中调用remove会失败,忽略错误
            }
          }
        }
      }
    )
  } catch (error) {
    console.error('Supabase服务端客户端初始化失败:', error)
    throw error
  }
}

/**
 * 创建管理员客户端(使用service_role_key)
 * 注意: 仅在服务端API路由中使用
 */
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {}
    }
  )
}

