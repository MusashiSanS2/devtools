'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ToolPageHeaderProps {
  label: string
  tag: string
  description: string
  icon: LucideIcon
  color: string
  index?: number
}

export default function ToolPageHeader({
  label, tag, description, icon: Icon, color, index = 0,
}: ToolPageHeaderProps) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="-mx-5 -mt-5 mb-1 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(10,10,15,0.0) 0%, ${color}10 100%)`,
        borderBottom: `1px solid ${color}25`,
      }}
    >
      {/* Ambient glow behind icon */}
      <div
        className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at right center, ${color}18 0%, transparent 70%)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
      />

      <div className="relative flex items-center justify-between px-8 py-7">
        {/* Left content */}
        <div className="flex flex-col gap-2 min-w-0">
          {/* Number + tag row */}
          <div className="flex items-center gap-3">
            <span
              className="font-fira text-xs font-bold"
              style={{ color: `${color}55` }}
            >
              {num}
            </span>
            <span
              className="font-fira text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                background: `${color}14`,
                color: color,
                border: `1px solid ${color}30`,
              }}
            >
              {tag}
            </span>
          </div>

          {/* Tool name */}
          <h1
            className="font-black font-syne leading-none tracking-tight"
            style={{
              fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
              color: '#e8e8f4',
            }}
          >
            {label}
          </h1>

          {/* Description */}
          <p
            className="text-xs leading-relaxed max-w-sm"
            style={{ color: '#70708a' }}
          >
            {description}
          </p>
        </div>

        {/* Right — giant icon */}
        <div className="relative shrink-0 ml-6 hidden sm:block">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse, ${color}22 0%, transparent 70%)`,
              filter: 'blur(16px)',
              transform: 'scale(1.4)',
            }}
          />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: `${color}10`,
              border: `1px solid ${color}25`,
            }}
          >
            <Icon
              style={{
                width: 36,
                height: 36,
                color: color,
                filter: `drop-shadow(0 0 12px ${color}80)`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
