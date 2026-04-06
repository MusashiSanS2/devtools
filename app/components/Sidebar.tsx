'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Palette,
  Layers,
  BoxSelect,
  Regex,
  Binary,
  Braces,
  Zap,
  X,
  LayoutGrid,
} from 'lucide-react'
import { cn } from '../lib/utils'

const tools = [
  {
    href: '/tools',
    label: 'Todas',
    description: 'Hub de ferramentas',
    icon: LayoutGrid,
    accent: 'text-accent-purple',
    activeBg: 'bg-accent-purple/10',
    activeBorder: 'border-accent-purple/30',
  },
  {
    href: '/readme',
    label: 'README',
    description: 'Generator',
    icon: FileText,
    accent: 'text-accent-blue',
    activeBg: 'bg-accent-blue/10',
    activeBorder: 'border-accent-blue/30',
  },
  {
    href: '/colors',
    label: 'Colors',
    description: 'Palette',
    icon: Palette,
    accent: 'text-accent-purple',
    activeBg: 'bg-accent-purple/10',
    activeBorder: 'border-accent-purple/30',
  },
  {
    href: '/gradient',
    label: 'Gradient',
    description: 'CSS Generator',
    icon: Layers,
    accent: 'text-accent-pink',
    activeBg: 'bg-accent-pink/10',
    activeBorder: 'border-accent-pink/30',
  },
  {
    href: '/shadows',
    label: 'Shadows',
    description: 'Box Shadow',
    icon: BoxSelect,
    accent: 'text-accent-cyan',
    activeBg: 'bg-accent-cyan/10',
    activeBorder: 'border-accent-cyan/30',
  },
  {
    href: '/regex',
    label: 'Regex',
    description: 'Tester',
    icon: Regex,
    accent: 'text-accent-orange',
    activeBg: 'bg-accent-orange/10',
    activeBorder: 'border-accent-orange/30',
  },
  {
    href: '/base64',
    label: 'Base64',
    description: 'Encode / Decode',
    icon: Binary,
    accent: 'text-accent-green',
    activeBg: 'bg-accent-green/10',
    activeBorder: 'border-accent-green/30',
  },
  {
    href: '/json',
    label: 'JSON',
    description: 'Formatter',
    icon: Braces,
    accent: 'text-accent-yellow',
    activeBg: 'bg-accent-yellow/10',
    activeBorder: 'border-accent-yellow/30',
  },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-blue" />
          </div>
          <span className="font-syne font-bold text-base text-text tracking-tight">DevKit</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-subtle hover:text-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-xs font-medium text-subtle uppercase tracking-wider">Tools</p>
        {tools.map((tool, idx) => {
          const Icon = tool.icon
          const isActive = pathname === tool.href
          return (
            <div key={tool.href}>
              {idx === 1 && (
                <div className="my-2 mx-2 h-px bg-border" />
              )}
              <Link
                href={tool.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-150 group mb-0.5',
                  isActive
                    ? `${tool.activeBg} ${tool.activeBorder}`
                    : 'border-transparent hover:bg-surface hover:border-border'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? tool.accent : 'text-subtle group-hover:text-text'
                  )}
                />
                <div className="min-w-0">
                  <div
                    className={cn(
                      'text-sm font-medium leading-none mb-0.5 transition-colors',
                      isActive ? 'text-text' : 'text-subtle group-hover:text-text'
                    )}
                  >
                    {tool.label}
                  </div>
                  <div className="text-xs text-subtle/70 leading-none">{tool.description}</div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className={cn('ml-auto w-1.5 h-1.5 rounded-full', tool.accent.replace('text-', 'bg-'))}
                  />
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="text-xs text-subtle/50 text-center">
          v1.0.0 · 7 ferramentas
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border bg-bg h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -224 }}
            animate={{ x: 0 }}
            exit={{ x: -224 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-56 border-r border-border bg-bg"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
