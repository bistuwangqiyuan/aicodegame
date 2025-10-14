/**
 * 课程数据种子脚本
 * 将课程数据导入Supabase数据库
 */

import { createClient } from '@supabase/supabase-js'
import { COURSE_DATA } from '../src/lib/course-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedCourses() {
  console.log('🌱 开始导入课程数据...\n')

  try {
    // 遍历所有Level的课程
    for (const [, courseData] of Object.entries(COURSE_DATA)) {
      console.log(`📚 导入 ${courseData.title}...`)

      // 插入课程
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          level: courseData.level,
          order: courseData.order,
          is_published: true,
          created_by: null
        })
        .select()
        .single()

      if (courseError) {
        console.error(`❌ 导入课程失败:`, courseError)
        continue
      }

      console.log(`  ✅ 课程创建成功: ${course.id}`)

      // 插入课程关卡
      for (const lesson of courseData.lessons) {
        const { error: lessonError } = await supabase
          .from('lessons')
          .insert({
            course_id: course.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            order: lesson.order,
            xp_reward: lesson.xp_reward,
            coin_reward: lesson.coin_reward,
            difficulty: lesson.difficulty
          })

        if (lessonError) {
          console.error(`  ❌ 导入关卡失败: ${lesson.title}`, lessonError)
        } else {
          console.log(`    ✅ 关卡创建: ${lesson.title}`)
        }
      }

      console.log(`  📝 完成 ${courseData.lessons.length} 个关卡\n`)
    }

    console.log('🎉 所有课程数据导入完成!')
    console.log('\n📊 统计:')
    console.log(`  - 课程数量: ${Object.keys(COURSE_DATA).length}`)
    const totalLessons = Object.values(COURSE_DATA).reduce(
      (sum, course) => sum + course.lessons.length,
      0
    )
    console.log(`  - 关卡总数: ${totalLessons}`)
  } catch (error) {
    console.error('💥 导入过程中发生错误:', error)
    process.exit(1)
  }
}

// 执行导入
seedCourses().then(() => {
  console.log('\n✨ 完成!')
  process.exit(0)
})

