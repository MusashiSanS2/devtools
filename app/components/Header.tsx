'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

const routeMeta: Record<string, { title: string; description: string; accent: string }> = {
  '/tools': {
    title: 'Ferramentas',
    description: 'Todas as ferramentas do DevKit',
    accent: 'text-accent-purple',
  },
  '/readme': {
    title: 'README Generator',
    description: 'Create beautiful README files for your projects',
    accent: 'text-accent-blue',
  },
  '/colors': {
    title: 'Color Palette',
    description: 'Generate and export harmonic color palettes',
    accent: 'text-accent-purple',
  },
  '/gradient': {
    title: 'Gradient Generator',
    description: 'Build CSS gradients visually',
    accent: 'text-accent-pink',
  },
  '/shadows': {
    title: 'Box Shadow Builder',
    description: 'Compose multi-layer CSS shadows with live preview',
    accent: 'text-accent-cyan',
  },
  '/regex': {
    title: 'Regex Tester',
    description: 'Test patterns with real-time match highlighting',
    accent: 'text-accent-orange',
  },
  '/base64': {
    title: 'Base64 Encoder / Decoder',
    description: 'Encode and decode strings in real time',
    accent: 'text-accent-green',
  },
  '/json': {
    title: 'JSON Formatter',
    description: 'Format, validate and minify JSON',
    accent: 'text-accent-yellow',
  },
}

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const meta = routeMeta[pathname] ?? routeMeta['/tools']

  return (
    <header className="h-14 shrink-0 border-b border-border bg-bg/80 backdrop-blur-md flex items-center px-5 gap-4 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-subtle hover:text-text transition-colors p-1 -ml-1"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className={`text-sm font-semibold font-syne truncate ${meta.accent}`}>
            {meta.title}
          </h1>
          <p className="text-xs text-subtle truncate hidden sm:block">{meta.description}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        <span className="text-xs text-subtle hidden sm:block">Client-side</span>
      </div>
    </header>
  )
}
