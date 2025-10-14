/**
 * 代码编辑器页面
 */

'use client'

import { useState } from 'react'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { PreviewPane } from '@/components/editor/PreviewPane'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/stores/editor-store'
import {
  Code2,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Settings,
  Layout,
  FileCode,
  Palette,
  Braces
} from 'lucide-react'

export default function EditorPage() {
  const {
    htmlCode,
    cssCode,
    jsCode,
    activeTab,
    isPreviewVisible,
    layout,
    theme,
    setHtmlCode,
    setCssCode,
    setJsCode,
    setActiveTab,
    togglePreview,
    toggleLayout,
    resetCode
  } = useEditorStore()

  const [isSaving, setIsSaving] = useState(false)

  // 保存代码到数据库
  const handleSave = async () => {
    setIsSaving(true)
    // TODO: 实现保存到Supabase的逻辑
    console.log('保存代码...')
    
    setTimeout(() => {
      setIsSaving(false)
      alert('代码已保存!')
    }, 1000)
  }

  // 标签配置
  const tabs = [
    { id: 'html' as const, label: 'HTML', icon: FileCode, color: 'text-orange-500' },
    { id: 'css' as const, label: 'CSS', icon: Palette, color: 'text-blue-500' },
    { id: 'javascript' as const, label: 'JavaScript', icon: Braces, color: 'text-yellow-500' }
  ]

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">代码编辑器</h1>
          </div>

          {/* 标签切换 */}
          <div className="flex gap-1 rounded-lg border p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeTab === tab.id ? '' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={toggleLayout} title="切换布局">
            <Layout className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={togglePreview}
            title={isPreviewVisible ? '隐藏预览' : '显示预览'}
          >
            {isPreviewVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          <Button size="sm" variant="ghost" onClick={resetCode} title="重置代码">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" title="设置">
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? '保存中...' : '保存'}</span>
          </Button>
        </div>
      </div>

      {/* 编辑器和预览区域 */}
      <div className={`flex flex-1 overflow-hidden ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
        {/* 代码编辑器区域 */}
        <div className={`flex flex-col ${isPreviewVisible ? (layout === 'horizontal' ? 'w-1/2' : 'h-1/2') : 'w-full'} border-r`}>
          {activeTab === 'html' && (
            <CodeEditor
              language="html"
              value={htmlCode}
              onChange={setHtmlCode}
              theme={theme}
            />
          )}
          {activeTab === 'css' && (
            <CodeEditor
              language="css"
              value={cssCode}
              onChange={setCssCode}
              theme={theme}
            />
          )}
          {activeTab === 'javascript' && (
            <CodeEditor
              language="javascript"
              value={jsCode}
              onChange={setJsCode}
              theme={theme}
            />
          )}
        </div>

        {/* 预览区域 */}
        {isPreviewVisible && (
          <div className={`${layout === 'horizontal' ? 'w-1/2' : 'h-1/2'}`}>
            <PreviewPane
              htmlCode={htmlCode}
              cssCode={cssCode}
              jsCode={jsCode}
              autoRefresh={true}
              refreshDelay={1000}
            />
          </div>
        )}
      </div>
    </div>
  )
}

