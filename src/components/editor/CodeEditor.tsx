/**
 * 代码编辑器组件
 * 基于Monaco Editor
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript'
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  height?: string
  theme?: 'vs' | 'vs-dark'
}

export function CodeEditor({
  language,
  value,
  onChange,
  readOnly = false,
  height = '100%',
  theme = 'vs-dark'
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isReady, setIsReady] = useState(false)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // 配置编辑器选项
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      readOnly
    })

    // 配置语言特性
    if (language === 'html') {
      monaco.languages.html.htmlDefaults.setOptions({
        format: {
          tabSize: 2,
          insertSpaces: true,
          wrapLineLength: 120,
          unformatted: 'wbr',
          contentUnformatted: 'pre,code,textarea',
          indentInnerHtml: false,
          preserveNewLines: true,
          maxPreserveNewLines: 2,
          indentHandlebars: false,
          endWithNewline: false,
          extraLiners: 'head, body, /html',
          wrapAttributes: 'auto'
        }
      })
    }

    setIsReady(true)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  // 格式化代码
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
    }
  }

  // 暴露格式化方法给父组件
  useEffect(() => {
    if (isReady && (window as any).formatCode) {
      (window as any).formatCode[language] = formatCode
    }
  }, [isReady, language])

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme={theme}
        loading={
          <div className="flex h-full items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">加载编辑器...</p>
            </div>
          </div>
        }
        options={{
          readOnly,
          contextmenu: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  )
}

