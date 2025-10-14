/**
 * 代码编辑器状态管理Store
 */

import { create } from 'zustand'

interface EditorStore {
  // 代码内容
  htmlCode: string
  cssCode: string
  jsCode: string

  // 编辑器设置
  theme: 'vs' | 'vs-dark'
  fontSize: number
  autoSave: boolean

  // UI状态
  activeTab: 'html' | 'css' | 'javascript'
  isPreviewVisible: boolean
  layout: 'horizontal' | 'vertical'

  // 操作
  setHtmlCode: (code: string) => void
  setCssCode: (code: string) => void
  setJsCode: (code: string) => void
  setActiveTab: (tab: 'html' | 'css' | 'javascript') => void
  setTheme: (theme: 'vs' | 'vs-dark') => void
  setFontSize: (size: number) => void
  togglePreview: () => void
  toggleLayout: () => void
  setAutoSave: (enabled: boolean) => void
  resetCode: () => void
  loadCode: (html: string, css: string, js: string) => void
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>我的网页</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>这是我的第一个网页</p>
</body>
</html>`

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
}`

const DEFAULT_JS = `console.log('欢迎来到 GameCode Lab!');

// 你的JavaScript代码写在这里
document.addEventListener('DOMContentLoaded', function() {
  console.log('页面加载完成');
});`

export const useEditorStore = create<EditorStore>((set) => ({
  // 初始代码
  htmlCode: DEFAULT_HTML,
  cssCode: DEFAULT_CSS,
  jsCode: DEFAULT_JS,

  // 编辑器设置
  theme: 'vs-dark',
  fontSize: 14,
  autoSave: true,

  // UI状态
  activeTab: 'html',
  isPreviewVisible: true,
  layout: 'horizontal',

  // 操作方法
  setHtmlCode: (code) => set({ htmlCode: code }),
  setCssCode: (code) => set({ cssCode: code }),
  setJsCode: (code) => set({ jsCode: code }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (size) => set({ fontSize: size }),
  togglePreview: () => set((state) => ({ isPreviewVisible: !state.isPreviewVisible })),
  toggleLayout: () => set((state) => ({
    layout: state.layout === 'horizontal' ? 'vertical' : 'horizontal'
  })),
  setAutoSave: (enabled) => set({ autoSave: enabled }),

  // 重置代码
  resetCode: () => set({
    htmlCode: DEFAULT_HTML,
    cssCode: DEFAULT_CSS,
    jsCode: DEFAULT_JS
  }),

  // 加载代码
  loadCode: (html, css, js) => set({
    htmlCode: html,
    cssCode: css,
    jsCode: js
  })
}))

