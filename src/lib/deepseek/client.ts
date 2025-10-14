/**
 * DeepSeek API客户端
 * 处理所有与DeepSeek AI的交互
 */

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class DeepSeekClient {
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(
    apiKey: string = process.env.DEEPSEEK_API_KEY || '',
    baseURL: string = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com',
    model: string = 'deepseek-coder'
  ) {
    this.apiKey = apiKey
    this.baseURL = baseURL
    this.model = model
  }

  /**
   * 发送聊天请求
   */
  async chat(
    messages: DeepSeekMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      stream?: boolean
    }
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API密钥未配置')
    }

    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 2000,
          stream: options?.stream || false
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`DeepSeek API错误: ${error.message || response.statusText}`)
      }

      const data: DeepSeekResponse = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('DeepSeek API调用失败:', error)
      throw error
    }
  }

  /**
   * 代码讲解
   */
  async explainCode(
    code: string,
    language: string,
    context?: string
  ): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          '你是一个专业的编程教学助手。你的任务是用简单易懂的中文解释代码,适合编程初学者理解。'
      },
      {
        role: 'user',
        content: `请详细解释以下${language}代码的作用:\n\n\`\`\`${language}\n${code}\n\`\`\`${context ? `\n\n上下文: ${context}` : ''}\n\n请逐行解释,并说明整体功能。`
      }
    ]

    return await this.chat(messages, { temperature: 0.7, maxTokens: 1500 })
  }

  /**
   * 代码评分与反馈
   */
  async gradeCode(
    code: string,
    language: string,
    requirements: string
  ): Promise<{
    score: number
    feedback: string
    suggestions: string[]
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          '你是一个严格但友好的代码评审专家。请对学生的代码进行评分(0-100分)和反馈。'
      },
      {
        role: 'user',
        content: `任务要求:\n${requirements}\n\n学生提交的${language}代码:\n\`\`\`${language}\n${code}\n\`\`\`\n\n请按以下格式评分:\n1. 给出总分(0-100)\n2. 评价功能完整性、代码规范性、性能优化\n3. 提供具体改进建议`
      }
    ]

    const response = await this.chat(messages, {
      temperature: 0.5,
      maxTokens: 1000
    })

    // 解析AI响应
    const scoreMatch = response.match(/总分[：:]\s*(\d+)/i)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 70

    // 提取建议
    const suggestions: string[] = []
    const suggestionMatches = response.match(/\d+\.\s*(.+?)(?=\n\d+\.|$)/g)
    if (suggestionMatches) {
      suggestions.push(...suggestionMatches.map(s => s.trim()))
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      feedback: response,
      suggestions
    }
  }

  /**
   * 代码错误诊断
   */
  async diagnoseError(
    code: string,
    language: string,
    errorMessage?: string
  ): Promise<{
    problem: string
    solution: string
    fixedCode?: string
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          '你是一个耐心的编程导师。帮助学生找出代码中的问题并提供修复方案。'
      },
      {
        role: 'user',
        content: `请帮我诊断这段${language}代码的问题:\n\n\`\`\`${language}\n${code}\n\`\`\`${errorMessage ? `\n\n错误信息: ${errorMessage}` : ''}\n\n请说明:\n1. 问题是什么\n2. 如何修复\n3. 提供修复后的代码`
      }
    ]

    const response = await this.chat(messages, {
      temperature: 0.5,
      maxTokens: 1500
    })

    // 提取修复后的代码
    const codeMatch = response.match(/```(?:\w+)?\n([\s\S]+?)\n```/)
    const fixedCode = codeMatch ? codeMatch[1].trim() : undefined

    // 提取问题和解决方案
    const problemMatch = response.match(/问题.*?[:：]\s*(.+?)(?=\n|如何|$)/i)
    const solutionMatch = response.match(/修复.*?[:：]\s*(.+?)(?=\n|提供|$)/i)

    return {
      problem: problemMatch ? problemMatch[1].trim() : '代码可能存在逻辑或语法错误',
      solution: solutionMatch
        ? solutionMatch[1].trim()
        : '请检查代码语法和逻辑',
      fixedCode
    }
  }

  /**
   * 生成代码提示
   */
  async generateHint(
    task: string,
    currentCode: string,
    language: string
  ): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          '你是一个编程学习助手。提供渐进式的提示,帮助学生自己完成任务,而不是直接给出答案。'
      },
      {
        role: 'user',
        content: `任务: ${task}\n\n学生当前的代码:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\n请给出下一步提示（不要直接给出完整答案）。`
      }
    ]

    return await this.chat(messages, { temperature: 0.8, maxTokens: 500 })
  }

  /**
   * 生成练习题
   */
  async generateExercise(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard',
    language: string
  ): Promise<{
    title: string
    description: string
    starterCode: string
    solution: string
    hints: string[]
  }> {
    const difficultyMap = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    }

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: '你是一个编程教育专家,擅长设计编程练习题。'
      },
      {
        role: 'user',
        content: `请为"${topic}"主题生成一道${difficultyMap[difficulty]}难度的${language}练习题。\n\n要求:\n1. 标题\n2. 详细描述\n3. 初始代码\n4. 参考答案\n5. 3个渐进式提示`
      }
    ]

    const response = await this.chat(messages, {
      temperature: 0.8,
      maxTokens: 2000
    })

    // 解析响应（简化版,实际应该更严格）
    const titleMatch = response.match(/标题.*?[:：]\s*(.+?)(?=\n|$)/i)
    const title = titleMatch ? titleMatch[1].trim() : `${topic} 练习`

    return {
      title,
      description: response,
      starterCode: `// ${topic} 练习\n// 在这里编写你的代码\n`,
      solution: '',
      hints: ['检查代码结构', '注意边界情况', '测试不同输入']
    }
  }

  /**
   * AI聊天对话
   */
  async chatWithMentor(
    userMessage: string,
    conversationHistory: DeepSeekMessage[] = []
  ): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          '你是 CodeMentor DS,一个友好、专业的编程导师。你的目标是帮助学生学习HTML、CSS和JavaScript。回答要简洁、准确、鼓励性,适合编程初学者。'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ]

    return await this.chat(messages, { temperature: 0.9, maxTokens: 1000 })
  }
}

// 导出单例实例
export const deepseek = new DeepSeekClient()

