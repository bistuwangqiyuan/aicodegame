/**
 * 代码预览面板组件
 * 在安全的Iframe沙盒中执行代码并显示结果
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Maximize2, Minimize2, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewPaneProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  autoRefresh?: boolean
  refreshDelay?: number
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop'

export function PreviewPane({
  htmlCode,
  cssCode,
  jsCode,
  autoRefresh = true,
  refreshDelay = 1000
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const refreshTimeoutRef = useRef<NodeJS.Timeout>()

  // 组合代码为完整HTML
  const generateFullHTML = () => {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    // 拦截console.log并发送到父窗口
    (function() {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = function(...args) {
        originalLog.apply(console, args);
        window.parent.postMessage({
          type: 'console',
          method: 'log',
          args: args.map(arg => String(arg))
        }, '*');
      };

      console.error = function(...args) {
        originalError.apply(console, args);
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: args.map(arg => String(arg))
        }, '*');
      };

      console.warn = function(...args) {
        originalWarn.apply(console, args);
        window.parent.postMessage({
          type: 'console',
          method: 'warn',
          args: args.map(arg => String(arg))
        }, '*');
      };

      // 捕获运行时错误
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: [\`Error: \${message} at line \${lineno}\`]
        }, '*');
        return false;
      };
    })();

    // 用户代码
    try {
      ${jsCode}
    } catch (error) {
      console.error('执行错误:', error.message);
    }
  </script>
</body>
</html>
    `
  }

  // 刷新预览
  const refreshPreview = () => {
    if (!iframeRef.current) return

    const fullHTML = generateFullHTML()
    const blob = new Blob([fullHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    // 使用srcdoc而非src以保持沙盒安全性
    iframeRef.current.srcdoc = fullHTML

    // 清空console输出
    setConsoleOutput([])
  }

  // 监听代码变化,自动刷新
  useEffect(() => {
    if (autoRefresh) {
      // 防抖刷新
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }

      refreshTimeoutRef.current = setTimeout(() => {
        refreshPreview()
      }, refreshDelay)

      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
      }
    }
  }, [htmlCode, cssCode, jsCode, autoRefresh, refreshDelay])

  // 监听Iframe的console消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const { method, args } = event.data
        const message = `[${method}] ${args.join(' ')}`
        setConsoleOutput(prev => [...prev, message])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // 设备模式切换
  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      default:
        return '100%'
    }
  }

  return (
    <div className={`flex h-full flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">预览</span>

          {/* 设备切换 */}
          <div className="flex gap-1 rounded-lg border p-1">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`rounded p-1 ${deviceMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="手机视图"
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`rounded p-1 ${deviceMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="平板视图"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`rounded p-1 ${deviceMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
              title="桌面视图"
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={refreshPreview}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 overflow-hidden bg-white p-4">
        <div
          className="mx-auto h-full overflow-auto rounded-lg border bg-white shadow-sm"
          style={{ width: getDeviceWidth() }}
        >
          <iframe
            ref={iframeRef}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin"
            title="Code Preview"
          />
        </div>
      </div>

      {/* 控制台输出 */}
      {consoleOutput.length > 0 && (
        <div className="border-t bg-gray-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">控制台输出</span>
            <button
              onClick={() => setConsoleOutput([])}
              className="text-xs text-gray-400 hover:text-white"
            >
              清空
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto rounded bg-black p-2 font-mono text-xs">
            {consoleOutput.map((output, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  output.includes('[error]')
                    ? 'text-red-400'
                    : output.includes('[warn]')
                      ? 'text-yellow-400'
                      : 'text-green-400'
                }`}
              >
                {output}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

