'use client'

import './globals.css'
import { Syne, Fira_Code } from 'next/font/google'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { ToastProvider } from './components/Toast'
import { usePathname } from 'next/navigation'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const fira = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isLanding = pathname === '/'

  return (
    <html lang="en" className={`${syne.variable} ${fira.variable}`}>
      <body className="bg-bg text-text font-syne antialiased">
        <ToastProvider>
          {isLanding ? (
            children
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}

              <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto h-full">
                  {children}
                </main>
              </div>
            </div>
          )}
        </ToastProvider>
      </body>
    </html>
  )
}
