/**
 * 课程初始数据
 * Level 1-5 的课程和关卡定义
 */

export const COURSE_DATA = {
  // Level 1: HTML5基础
  level1: {
    title: 'HTML5 基础',
    description: '学习网页的基本结构,掌握常用HTML标签',
    level: 1,
    order: 1,
    lessons: [
      {
        title: 'Hello HTML!',
        description: '认识HTML,创建你的第一个网页',
        order: 1,
        xp_reward: 10,
        coin_reward: 5,
        difficulty: 'easy' as const,
        content: {
          type: 'coding',
          instructions: `欢迎来到编程世界!

HTML是网页的骨架,让我们从最简单的开始。

**任务**: 创建一个包含标题和段落的网页
- 使用 <h1> 标签创建标题
- 使用 <p> 标签创建段落`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<head>
  <title>我的第一个网页</title>
</head>
<body>
  <!-- 在这里添加你的代码 -->
  
</body>
</html>`,
            css: '',
            js: ''
          },
          validation_rules: [
            {
              type: 'contains_tag',
              tag: 'h1',
              message: '需要包含 <h1> 标题标签'
            },
            {
              type: 'contains_tag',
              tag: 'p',
              message: '需要包含 <p> 段落标签'
            }
          ],
          hints: [
            '提示1: <h1>标签用于定义最重要的标题',
            '提示2: <p>标签用于定义段落',
            '提示3: 标签需要有开始和结束,例如 <h1>标题</h1>'
          ]
        }
      },
      {
        title: '文本格式化',
        description: '学习如何使用各种文本标签',
        order: 2,
        xp_reward: 15,
        coin_reward: 8,
        difficulty: 'easy' as const,
        content: {
          type: 'coding',
          instructions: `让我们学习更多文本格式化标签!

**任务**: 创建一段包含各种格式的文本
- 使用 <strong> 使文字加粗
- 使用 <em> 使文字斜体
- 使用 <u> 给文字加下划线`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>文本格式化</h1>
  <!-- 在这里练习各种文本格式 -->
  
</body>
</html>`,
            css: '',
            js: ''
          },
          validation_rules: [
            {
              type: 'contains_tag',
              tag: 'strong',
              message: '需要使用 <strong> 标签'
            },
            {
              type: 'contains_tag',
              tag: 'em',
              message: '需要使用 <em> 标签'
            }
          ],
          hints: [
            '<strong>文字</strong> 显示为粗体',
            '<em>文字</em> 显示为斜体',
            '可以组合使用多个标签'
          ]
        }
      },
      {
        title: '列表',
        description: '学习创建有序列表和无序列表',
        order: 3,
        xp_reward: 15,
        coin_reward: 8,
        difficulty: 'easy' as const,
        content: {
          type: 'coding',
          instructions: `列表是网页中常用的元素!

**任务**: 创建一个购物清单和待办事项
- 使用 <ul> 和 <li> 创建无序列表(购物清单)
- 使用 <ol> 和 <li> 创建有序列表(待办事项)`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h2>我的购物清单</h2>
  <!-- 在这里创建无序列表 -->
  
  <h2>今日待办</h2>
  <!-- 在这里创建有序列表 -->
  
</body>
</html>`,
            css: '',
            js: ''
          },
          validation_rules: [
            { type: 'contains_tag', tag: 'ul', message: '需要包含无序列表 <ul>' },
            { type: 'contains_tag', tag: 'ol', message: '需要包含有序列表 <ol>' },
            { type: 'contains_tag', tag: 'li', message: '需要包含列表项 <li>' }
          ],
          hints: [
            '<ul> 表示无序列表(带圆点)',
            '<ol> 表示有序列表(带数字)',
            '每个列表项用 <li> 标签包裹'
          ]
        }
      },
      {
        title: '链接和图片',
        description: '学习如何添加链接和图片',
        order: 4,
        xp_reward: 20,
        coin_reward: 10,
        difficulty: 'medium' as const,
        content: {
          type: 'coding',
          instructions: `让网页更丰富!

**任务**: 创建包含链接和图片的网页
- 使用 <a> 标签创建链接
- 使用 <img> 标签插入图片`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>我的网页</h1>
  
  <!-- 添加一个链接到 Google -->
  
  <!-- 添加一张图片 -->
  
</body>
</html>`,
            css: '',
            js: ''
          },
          validation_rules: [
            { type: 'contains_tag', tag: 'a', message: '需要包含链接 <a>' },
            { type: 'contains_tag', tag: 'img', message: '需要包含图片 <img>' }
          ],
          hints: [
            '<a href="网址">链接文字</a>',
            '<img src="图片地址" alt="图片描述">',
            'img标签是自闭合的,不需要结束标签'
          ]
        }
      },
      {
        title: '表格',
        description: '学习创建HTML表格',
        order: 5,
        xp_reward: 20,
        coin_reward: 10,
        difficulty: 'medium' as const,
        content: {
          type: 'coding',
          instructions: `表格用于展示结构化数据!

**任务**: 创建一个课程表
- 使用 <table> 创建表格
- 使用 <tr> 创建行
- 使用 <th> 创建表头
- 使用 <td> 创建单元格`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h2>我的课程表</h2>
  
  <!-- 在这里创建表格 -->
  
</body>
</html>`,
            css: '',
            js: ''
          },
          validation_rules: [
            { type: 'contains_tag', tag: 'table', message: '需要包含 <table>' },
            { type: 'contains_tag', tag: 'tr', message: '需要包含 <tr>' },
            { type: 'contains_tag', tag: 'td', message: '需要包含 <td>' }
          ],
          hints: [
            'table包含多个tr(行)',
            '每个tr包含多个td(单元格)',
            'th用于表头单元格'
          ]
        }
      }
    ]
  },

  // Level 2: CSS样式
  level2: {
    title: 'CSS 样式设计',
    description: '学习美化网页,掌握CSS基础样式',
    level: 2,
    order: 2,
    lessons: [
      {
        title: 'CSS初体验',
        description: '认识CSS,给网页添加颜色',
        order: 1,
        xp_reward: 15,
        coin_reward: 8,
        difficulty: 'easy' as const,
        content: {
          type: 'coding',
          instructions: `CSS让网页变得漂亮!

**任务**: 给网页添加样式
- 设置背景颜色
- 改变文字颜色
- 调整文字大小`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>欢迎学习CSS!</h1>
  <p>CSS让网页变得更美观</p>
</body>
</html>`,
            css: `/* 在这里编写CSS */
body {
  
}

h1 {
  
}

p {
  
}`,
            js: ''
          },
          validation_rules: [
            { type: 'contains_css', property: 'color', message: '需要设置颜色' },
            { type: 'contains_css', property: 'background', message: '需要设置背景' }
          ],
          hints: [
            'background-color: 颜色; 设置背景色',
            'color: 颜色; 设置文字颜色',
            'font-size: 大小; 设置文字大小'
          ]
        }
      },
      {
        title: '盒模型',
        description: '理解CSS盒模型,学习padding和margin',
        order: 2,
        xp_reward: 20,
        coin_reward: 10,
        difficulty: 'medium' as const,
        content: {
          type: 'coding',
          instructions: `盒模型是CSS布局的基础!

**任务**: 使用盒模型属性
- 设置padding(内边距)
- 设置margin(外边距)
- 添加边框`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <div class="box">这是一个盒子</div>
  <div class="box">这是另一个盒子</div>
</body>
</html>`,
            css: `.box {
  background-color: lightblue;
  /* 在这里添加padding、margin和border */
  
}`,
            js: ''
          },
          validation_rules: [],
          hints: [
            'padding: 20px; 设置内边距',
            'margin: 10px; 设置外边距',
            'border: 2px solid black; 添加边框'
          ]
        }
      }
    ]
  },

  // Level 3: JavaScript基础
  level3: {
    title: 'JavaScript 基础',
    description: '学习编程逻辑,让网页动起来',
    level: 3,
    order: 3,
    lessons: [
      {
        title: 'JavaScript初体验',
        description: '第一个JavaScript程序',
        order: 1,
        xp_reward: 20,
        coin_reward: 10,
        difficulty: 'easy' as const,
        content: {
          type: 'coding',
          instructions: `JavaScript让网页具备交互能力!

**任务**: 使用console.log输出信息
- 在控制台输出 "Hello JavaScript!"
- 创建变量并输出`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h1>JavaScript 初体验</h1>
  <p>打开控制台查看输出</p>
</body>
</html>`,
            css: '',
            js: `// 在这里编写JavaScript代码
console.log('Hello JavaScript!');

// 创建变量
let name = 'GameCode Lab';

// 输出变量
`
          },
          validation_rules: [],
          hints: [
            'console.log() 用于输出信息到控制台',
            'let 用于声明变量',
            '字符串用引号包裹'
          ]
        }
      }
    ]
  },

  // Level 4: DOM操作
  level4: {
    title: 'DOM 操作',
    description: '学习操作网页元素,实现动态交互',
    level: 4,
    order: 4,
    lessons: [
      {
        title: '按钮点击',
        description: '学习事件监听,实现按钮点击效果',
        order: 1,
        xp_reward: 25,
        coin_reward: 15,
        difficulty: 'medium' as const,
        content: {
          type: 'coding',
          instructions: `让按钮响应点击!

**任务**: 实现按钮点击改变文字
- 获取按钮元素
- 添加点击事件监听
- 改变页面内容`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<body>
  <h1 id="title">点击按钮试试!</h1>
  <button id="btn">点我</button>
</body>
</html>`,
            css: `button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}`,
            js: `// 获取元素
const btn = document.getElementById('btn');
const title = document.getElementById('title');

// 添加点击事件
btn.addEventListener('click', function() {
  // 在这里改变title的文字
  
});`
          },
          validation_rules: [],
          hints: [
            'document.getElementById() 获取元素',
            'addEventListener() 添加事件监听',
            'textContent 可以改变元素文字'
          ]
        }
      }
    ]
  },

  // Level 5: 综合实战
  level5: {
    title: '综合实战项目',
    description: '运用所学知识,完成真实项目',
    level: 5,
    order: 5,
    lessons: [
      {
        title: '个人主页项目',
        description: '创建一个完整的个人主页',
        order: 1,
        xp_reward: 100,
        coin_reward: 50,
        difficulty: 'hard' as const,
        content: {
          type: 'project',
          instructions: `创建你的个人主页!

**项目要求**:
1. 包含个人介绍
2. 展示技能列表
3. 添加联系方式
4. 使用CSS美化页面
5. 添加交互效果

**评分标准**:
- 功能完整性 (40%)
- 代码规范性 (30%)
- 设计美观度 (30%)`,
          starter_code: {
            html: `<!DOCTYPE html>
<html>
<head>
  <title>我的个人主页</title>
</head>
<body>
  <!-- 开始你的创作吧! -->
  
</body>
</html>`,
            css: `/* 你的样式 */
`,
            js: `// 你的JavaScript代码
`
          },
          validation_rules: [],
          hints: [
            '合理使用语义化标签',
            '保持代码缩进和注释',
            '测试不同屏幕尺寸'
          ]
        }
      }
    ]
  }
}

