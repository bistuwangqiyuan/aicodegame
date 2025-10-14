/**
 * 应用全局常量配置
 */

// ============================================
// 应用配置
// ============================================

export const APP_NAME = 'GameCode Lab'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = '游戏化HTML5编程教育平台'

// ============================================
// 游戏化配置
// ============================================

/** 等级配置 */
export const LEVELS = {
  MAX_LEVEL: 10,
  TITLES: [
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
} as const

/** 经验值奖励 */
export const XP_REWARDS = {
  EASY_TASK: 10,
  MEDIUM_TASK: 30,
  HARD_TASK: 80,
  PROJECT: 150,
  DAILY_LOGIN: 5,
  FIRST_ACHIEVEMENT: 20,
  HELP_OTHERS: 10
} as const

/** 金币奖励 */
export const COIN_REWARDS = {
  EASY_TASK: 5,
  MEDIUM_TASK: 15,
  HARD_TASK: 40,
  PROJECT: 100,
  DAILY_LOGIN: 10,
  WEEK_STREAK: 50
} as const

/** 成就稀有度 */
export const ACHIEVEMENT_RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const

// ============================================
// 课程配置
// ============================================

/** 课程难度 */
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const

/** 课程等级 */
export const COURSE_LEVELS = {
  HTML_BASICS: 1,
  CSS_STYLING: 2,
  JS_FUNDAMENTALS: 3,
  DOM_MANIPULATION: 4,
  PROJECTS: 5
} as const

/** 课程状态 */
export const LESSON_STATUS = {
  LOCKED: 'locked',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const

// ============================================
// 用户角色
// ============================================

export const USER_ROLES = {
  GUEST: 'guest',
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
} as const

// ============================================
// 试用配置
// ============================================

/** 试用期天数 */
export const TRIAL_DURATION_DAYS = 30

/** 试用提醒时间点(剩余天数) */
export const TRIAL_REMINDERS = [7, 3, 1] as const

// ============================================
// API配置
// ============================================

/** API限流 */
export const API_RATE_LIMITS = {
  GUEST: 10, // 每小时
  STUDENT: 50, // 每小时
  TEACHER: 100, // 每小时
  ADMIN: 500 // 每小时
} as const

/** AI响应超时 */
export const AI_TIMEOUT = 30000 // 30秒

// ============================================
// 代码编辑器配置
// ============================================

/** 编辑器主题 */
export const EDITOR_THEMES = [
  'vs',
  'vs-dark',
  'hc-black',
  'github-light',
  'github-dark',
  'monokai',
  'dracula'
] as const

/** 编辑器字体大小范围 */
export const EDITOR_FONT_SIZE = {
  MIN: 12,
  DEFAULT: 14,
  MAX: 24
} as const

/** 代码执行超时 */
export const CODE_EXECUTION_TIMEOUT = 5000 // 5秒

// ============================================
// 社区配置
// ============================================

/** 作品排序方式 */
export const SORT_OPTIONS = {
  LATEST: 'latest',
  MOST_LIKED: 'most_liked',
  MOST_VIEWED: 'most_viewed',
  TRENDING: 'trending'
} as const

/** 每页作品数量 */
export const PROJECTS_PER_PAGE = 12

/** 评论最大长度 */
export const MAX_COMMENT_LENGTH = 500

// ============================================
// 文件配置
// ============================================

/** 允许的图片格式 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
] as const

/** 图片最大大小(MB) */
export const MAX_IMAGE_SIZE = 5

/** 代码最大长度(字符) */
export const MAX_CODE_LENGTH = 100000

// ============================================
// 成就ID列表
// ============================================

export const ACHIEVEMENT_IDS = {
  // 基础成就
  HELLO_WORLD: 'hello_world',
  FIRST_LESSON: 'first_lesson',
  FIRST_PROJECT: 'first_project',

  // 学习成就
  COMPLETE_LEVEL_1: 'complete_level_1',
  COMPLETE_LEVEL_2: 'complete_level_2',
  COMPLETE_LEVEL_3: 'complete_level_3',
  COMPLETE_LEVEL_4: 'complete_level_4',
  COMPLETE_LEVEL_5: 'complete_level_5',

  // 挑战成就
  PERFECT_SCORE: 'perfect_score',
  SPEED_DEMON: 'speed_demon',
  NO_ERRORS: 'no_errors',

  // 社交成就
  HELPFUL: 'helpful',
  POPULAR: 'popular',
  COMMUNITY_STAR: 'community_star',

  // 坚持成就
  WEEK_STREAK: 'week_streak',
  MONTH_STREAK: 'month_streak',
  YEAR_STREAK: 'year_streak',

  // 特殊成就
  BOSS_KILLER: 'boss_killer',
  GRADUATE: 'graduate',
  LEGEND: 'legend'
} as const

// ============================================
// 本地存储Key
// ============================================

export const STORAGE_KEYS = {
  TRIAL_START: 'trial_started_at',
  GUEST_ID: 'guest_user_id',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  EDITOR_SETTINGS: 'editor_settings',
  LAST_LESSON: 'last_lesson_id'
} as const

// ============================================
// 错误消息
// ============================================

export const ERROR_MESSAGES = {
  // 认证错误
  INVALID_CREDENTIALS: '邮箱或密码错误',
  EMAIL_ALREADY_EXISTS: '该邮箱已被注册',
  WEAK_PASSWORD: '密码强度不足,至少需要8位字符',

  // API错误
  RATE_LIMIT_EXCEEDED: '请求过于频繁,请稍后再试',
  AI_TIMEOUT: 'AI响应超时,请重试',
  NETWORK_ERROR: '网络连接失败,请检查网络',

  // 代码错误
  CODE_EXECUTION_ERROR: '代码执行失败',
  CODE_TOO_LONG: '代码长度超出限制',
  SYNTAX_ERROR: '代码语法错误',

  // 权限错误
  UNAUTHORIZED: '请先登录',
  FORBIDDEN: '权限不足',
  TRIAL_EXPIRED: '试用期已结束,请注册账号',

  // 通用错误
  UNKNOWN_ERROR: '未知错误,请重试',
  SERVER_ERROR: '服务器错误,请稍后再试'
} as const

// ============================================
// 成功消息
// ============================================

export const SUCCESS_MESSAGES = {
  // 认证
  LOGIN_SUCCESS: '登录成功!',
  REGISTER_SUCCESS: '注册成功!',
  LOGOUT_SUCCESS: '已退出登录',

  // 学习
  LESSON_COMPLETED: '恭喜完成本关卡!',
  LEVEL_UP: '恭喜升级!',
  ACHIEVEMENT_UNLOCKED: '解锁新成就!',

  // 操作
  SAVE_SUCCESS: '保存成功',
  PUBLISH_SUCCESS: '发布成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功'
} as const

// ============================================
// 路由路径
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LEARN: '/learn',
  EDITOR: '/editor',
  COMMUNITY: '/community',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  TEACHER: '/teacher',
  ADMIN: '/admin',
  SETTINGS: '/settings'
} as const

