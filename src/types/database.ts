/**
 * Supabase数据库类型定义
 * 此文件将由 `supabase gen types typescript` 自动生成
 * 当前为手动定义的占位类型
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          role: 'guest' | 'student' | 'teacher' | 'admin'
          level: number
          xp: number
          coins: number
          trial_started_at: string | null
          trial_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'guest' | 'student' | 'teacher' | 'admin'
          level?: number
          xp?: number
          coins?: number
          trial_started_at?: string | null
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: 'guest' | 'student' | 'teacher' | 'admin'
          level?: number
          xp?: number
          coins?: number
          trial_started_at?: string | null
          trial_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          level: number
          order: number
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          level: number
          order: number
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          level?: number
          order?: number
          is_published?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          content: Json
          order: number
          xp_reward: number
          coin_reward: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description: string
          content: Json
          order: number
          xp_reward?: number
          coin_reward?: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          content?: Json
          order?: number
          xp_reward?: number
          coin_reward?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          status: 'locked' | 'in_progress' | 'completed'
          score: number | null
          completed_at: string | null
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          status?: 'locked' | 'in_progress' | 'completed'
          score?: number | null
          completed_at?: string | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          status?: 'locked' | 'in_progress' | 'completed'
          score?: number | null
          completed_at?: string | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          html_code: string
          css_code: string
          js_code: string
          is_public: boolean
          likes_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          html_code?: string
          css_code?: string
          js_code?: string
          is_public?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          html_code?: string
          css_code?: string
          js_code?: string
          is_public?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          code: string
          title: string
          description: string
          icon: string
          xp_reward: number
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description: string
          icon: string
          xp_reward?: number
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string
          icon?: string
          xp_reward?: number
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      project_likes: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          user_id: string
          project_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'guest' | 'student' | 'teacher' | 'admin'
      lesson_status: 'locked' | 'in_progress' | 'completed'
      difficulty_level: 'easy' | 'medium' | 'hard'
      achievement_rarity: 'common' | 'rare' | 'epic' | 'legendary'
    }
  }
}

