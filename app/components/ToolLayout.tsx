'use client'

import { ReactNode } from 'react'

interface ToolLayoutProps {
  children: ReactNode
  className?: string
}

export default function ToolLayout({ children, className = '' }: ToolLayoutProps) {
  return (
    <div className={`h-full flex flex-col p-5 gap-5 ${className}`}>
      {children}
    </div>
  )
}

interface TwoColProps {
  left: ReactNode
  right: ReactNode
  leftClassName?: string
  rightClassName?: string
}

export function TwoCol({ left, right, leftClassName = '', rightClassName = '' }: TwoColProps) {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">
      <div className={`flex flex-col gap-4 min-h-0 ${leftClassName}`}>{left}</div>
      <div className={`flex flex-col gap-4 min-h-0 ${rightClassName}`}>{right}</div>
    </div>
  )
}

interface PanelProps {
  title?: string
  titleRight?: ReactNode
  children: ReactNode
  className?: string
  accent?: string
}

export function Panel({ title, titleRight, children, className = '', accent = 'border-border' }: PanelProps) {
  return (
    <div className={`flex flex-col bg-surface border rounded-xl overflow-hidden ${accent} ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-semibold text-subtle uppercase tracking-wider">{title}</span>
          {titleRight && <div className="flex items-center gap-2">{titleRight}</div>}
        </div>
      )}
      <div className="flex-1 p-4 min-h-0">{children}</div>
    </div>
  )
}

interface CopyButtonProps {
  onCopy: () => void
  label?: string
  small?: boolean
}

export function CopyButton({ onCopy, label = 'Copy', small = false }: CopyButtonProps) {
  return (
    <button
      onClick={onCopy}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border border-border bg-transparent text-subtle hover:border-muted hover:text-text active:scale-95 transition-all duration-150 select-none ${
        small ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'
      }`}
    >
      {label}
    </button>
  )
}
