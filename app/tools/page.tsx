'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText, Palette, Layers, BoxSelect, Terminal, Binary, Braces, ArrowRight,
} from 'lucide-react'

const tools = [
  {
    href: '/readme', label: 'README', tag: 'Generator',
    description: 'Gere READMEs bonitos e profissionais para seus projetos em segundos.',
    icon: FileText, color: '#4f8eff', glow: 'rgba(79,142,255,0.18)', border: 'rgba(79,142,255,0.22)',
  },
  {
    href: '/colors', label: 'Colors', tag: 'Palette',
    description: 'Crie e exporte paletas de cores harmônicas em CSS, Tailwind ou JSON.',
    icon: Palette, color: '#a855f7', glow: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.22)',
  },
  {
    href: '/gradient', label: 'Gradient', tag: 'CSS Generator',
    description: 'Construa gradientes CSS visualmente com preview em tempo real.',
    icon: Layers, color: '#ec4899', glow: 'rgba(236,72,153,0.18)', border: 'rgba(236,72,153,0.22)',
  },
  {
    href: '/shadows', label: 'Shadows', tag: 'Box Shadow',
    description: 'Componha sombras CSS multicamadas com editor visual interativo.',
    icon: BoxSelect, color: '#06b6d4', glow: 'rgba(6,182,212,0.18)', border: 'rgba(6,182,212,0.22)',
  },
  {
    href: '/regex', label: 'Regex', tag: 'Tester',
    description: 'Teste expressões regulares com highlighting de matches em tempo real.',
    icon: Terminal, color: '#f97316', glow: 'rgba(249,115,22,0.18)', border: 'rgba(249,115,22,0.22)',
  },
  {
    href: '/base64', label: 'Base64', tag: 'Encoder',
    description: 'Encode e decode strings Base64 instantaneamente no browser.',
    icon: Binary, color: '#22c55e', glow: 'rgba(34,197,94,0.18)', border: 'rgba(34,197,94,0.22)',
  },
  {
    href: '/json', label: 'JSON', tag: 'Formatter',
    description: 'Formate, valide e minifique JSON com syntax highlighting.',
    icon: Braces, color: '#eab308', glow: 'rgba(234,179,8,0.18)', border: 'rgba(234,179,8,0.22)',
  },
]

function ToolCard({
  tool, index, featured = false, wide = false,
}: {
  tool: typeof tools[0]; index: number; featured?: boolean; wide?: boolean
}) {
  const Icon = tool.icon
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className={[
        featured ? 'lg:col-span-2 lg:row-span-2' : '',
        wide ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      <Link
        href={tool.href}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(10,10,15,0.98)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: featured ? '2.4rem' : '1.75rem',
          minHeight: featured ? 420 : 220,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = tool.color + '44'
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = `0 0 0 1px ${tool.color}22, 0 20px 44px rgba(0,0,0,0.5), inset 0 0 80px ${tool.color}07`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.07)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}88, transparent)` }}
        />

        {/* Corner glow on hover */}
        <div
          className="absolute bottom-0 right-0 w-44 h-44 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at bottom right, ${tool.color}18 0%, transparent 65%)` }}
        />

        {/* Number */}
        <span
          className="absolute top-5 right-5 font-fira text-xs font-bold select-none"
          style={{ color: `${tool.color}33` }}
        >
          {num}
        </span>

        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-5"
          style={{ background: `${tool.color}14`, border: `1px solid ${tool.color}2a` }}
        >
          <Icon className={featured ? 'w-6 h-6' : 'w-5 h-5'} style={{ color: tool.color }} />
        </div>

        {/* Name + tag */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span
            className="font-black font-syne text-[#e8e8f0] group-hover:text-white transition-colors duration-200"
            style={{ fontSize: featured ? '1.15rem' : '0.95rem' }}
          >
            {tool.label}
          </span>
          <span
            className="font-fira text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: `${tool.color}14`, color: tool.color, border: `1px solid ${tool.color}28` }}
          >
            {tool.tag}
          </span>
        </div>

        {/* Description */}
        <p
          className="leading-relaxed flex-1"
          style={{ color: '#70708a', fontSize: featured ? '0.875rem' : '0.8rem' }}
        >
          {tool.description}
        </p>

        {/* CTA */}
        <div
          className="flex items-center gap-1.5 mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
          style={{ color: tool.color }}
        >
          Abrir ferramenta
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </motion.div>
  )
}

export default function ToolsPage() {
  return (
    <div className="p-6 lg:p-8 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-6" style={{ background: 'rgba(168,85,247,0.8)' }} />
          <span
            className="font-fira text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: 'rgba(168,85,247,0.9)' }}
          >
            Ferramentas
          </span>
        </div>
        <h1
          className="font-black font-syne text-[#e8e8f0] leading-tight mb-2"
          style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}
        >
          Todas as ferramentas
        </h1>
        <p className="text-sm" style={{ color: '#70708a' }}>
          Selecione uma ferramenta para começar. Tudo roda no seu browser.
        </p>
      </motion.div>

      {/* Bento grid */}
      {/*
        4-col desktop:
        Row 1–2: [README 2×2] [Colors 1×1] [Gradient 1×1]
                 [README    ] [Shadows 1×1] [Regex   1×1]
        Row 3:   [Base64 2×1             ] [JSON    2×1 ]
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
        <ToolCard tool={tools[0]} index={0} featured />
        <ToolCard tool={tools[1]} index={1} />
        <ToolCard tool={tools[2]} index={2} />
        <ToolCard tool={tools[3]} index={3} />
        <ToolCard tool={tools[4]} index={4} />
        <ToolCard tool={tools[5]} index={5} wide />
        <ToolCard tool={tools[6]} index={6} wide />
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 pt-6 border-t flex items-center justify-between"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <span className="font-fira text-xs" style={{ color: '#44445a' }}>
          7 ferramentas · 100% client-side · sem login
        </span>
        <span className="font-fira text-xs" style={{ color: '#44445a' }}>
          v1.0.0
        </span>
      </motion.div>
    </div>
  )
}
