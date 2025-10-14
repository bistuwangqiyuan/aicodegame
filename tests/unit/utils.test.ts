/**
 * 工具函数单元测试
 */

import { calculateLevel, formatDate } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('calculateLevel', () => {
    test('Level 1 with 0 XP', () => {
      const result = calculateLevel(0)
      expect(result.level).toBe(1)
      expect(result.currentXP).toBe(0)
      expect(result.nextLevelXP).toBe(100)
      expect(result.progress).toBe(0)
    })

    test('Level 1 with 50 XP', () => {
      const result = calculateLevel(50)
      expect(result.level).toBe(1)
      expect(result.currentXP).toBe(50)
      expect(result.nextLevelXP).toBe(100)
      expect(result.progress).toBe(50)
    })

    test('Level 2 with 100 XP', () => {
      const result = calculateLevel(100)
      expect(result.level).toBe(2)
      expect(result.currentXP).toBe(0)
      expect(result.nextLevelXP).toBe(150)
      expect(result.progress).toBe(0)
    })

    test('Level 2 with 150 XP', () => {
      const result = calculateLevel(150)
      expect(result.level).toBe(2)
      expect(result.currentXP).toBe(50)
      expect(result.nextLevelXP).toBe(150)
    })

    test('Level 5 with 1000 XP', () => {
      const result = calculateLevel(1000)
      expect(result.level).toBe(5)
    })

    test('Level 10 (max) with 10000 XP', () => {
      const result = calculateLevel(10000)
      expect(result.level).toBe(10)
      expect(result.progress).toBe(100)
    })

    test('Negative XP defaults to 0', () => {
      const result = calculateLevel(-100)
      expect(result.level).toBe(1)
      expect(result.currentXP).toBe(0)
    })
  })

  describe('formatDate', () => {
    test('Format ISO date string', () => {
      const date = '2024-01-15T10:30:00.000Z'
      const result = formatDate(date)
      expect(result).toMatch(/2024/)
    })

    test('Format Date object', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toMatch(/2024/)
    })
  })
})

