import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'GameCode Lab - 游戏化编程学习平台',
  description:
    '通过游戏化闯关学习HTML5、CSS、JavaScript,AI助教实时指导,让编程学习变得有趣!',
  keywords: [
    '编程学习',
    '游戏化教育',
    'HTML5',
    'CSS',
    'JavaScript',
    'AI助教',
    '在线编程'
  ],
  authors: [{ name: 'GameCode Lab Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    type: 'website',
    title: 'GameCode Lab - 游戏化编程学习平台',
    description: '通过游戏化闯关学习Web开发,AI助教实时指导',
    siteName: 'GameCode Lab',
    images: ['/og-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameCode Lab - 游戏化编程学习平台',
    description: '通过游戏化闯关学习Web开发,AI助教实时指导',
    images: ['/og-image.png']
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

