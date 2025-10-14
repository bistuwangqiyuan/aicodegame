import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并Tailwind CSS类名
 * @param inputs - 类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化数字(添加千分位)
 * @param num - 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num)
}

/**
 * 计算等级所需XP
 * @param level - 目标等级
 * @returns 所需XP总量
 */
export function calculateLevelXP(level: number): number {
  // Level 1: 0-100, Level 2: 101-300, Level 3: 301-600...
  // 公式: XP = level * (level + 1) * 50
  return level * (level + 1) * 50
}

/**
 * 根据XP计算当前等级
 * @param xp - 当前XP
 * @returns 等级信息
 */
export function calculateLevel(xp: number): {
  level: number
  currentXP: number
  nextLevelXP: number
  progress: number
} {
  let level = 1
  let totalXP = 0

  // 找到当前等级
  while (totalXP + calculateLevelXP(level) <= xp && level < 10) {
    totalXP += calculateLevelXP(level)
    level++
  }

  const currentXP = xp - totalXP
  const nextLevelXP = calculateLevelXP(level)
  const progress = (currentXP / nextLevelXP) * 100

  return {
    level,
    currentXP,
    nextLevelXP,
    progress: Math.min(progress, 100)
  }
}

/**
 * 获取等级称号
 * @param level - 等级
 * @returns 称号字符串
 */
export function getLevelTitle(level: number): string {
  const titles = [
    '新手',
    '学徒',
    '练习生',
    '开发者',
    '工程师',
    '专家',
    '大师',
    '宗师',
    '传奇',
    '网页高手'
  ]
  return titles[level - 1] || '未知'
}

/**
 * 格式化时间(相对时间)
 * @param date - 日期
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  )

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} 分钟前`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} 小时前`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} 天前`
  } else {
    return targetDate.toLocaleDateString('zh-CN')
  }
}

/**
 * 格式化持续时间
 * @param seconds - 秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 生成唯一ID
 * @returns UUID字符串
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间(ms)
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param limit - 时间间隔(ms)
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 深拷贝对象
 * @param obj - 要拷贝的对象
 * @returns 拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 检查是否为浏览器环境
 * @returns 是否为浏览器
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * 获取成就稀有度颜色
 * @param rarity - 稀有度
 * @returns Tailwind CSS颜色类名
 */
export function getAchievementColor(
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
): string {
  const colors = {
    common: 'text-gray-500 bg-gray-100',
    rare: 'text-blue-500 bg-blue-100',
    epic: 'text-purple-500 bg-purple-100',
    legendary: 'text-orange-500 bg-orange-100'
  }
  return colors[rarity]
}

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 * @param password - 密码
 * @returns 强度等级(0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return Math.min(strength, 4)
}

/**
 * 截断文本
 * @param text - 文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * 获取随机元素
 * @param array - 数组
 * @returns 随机元素
 */
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 打乱数组
 * @param array - 数组
 * @returns 打乱后的数组
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

