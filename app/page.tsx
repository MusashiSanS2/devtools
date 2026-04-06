'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import {
  Zap, FileText, Palette, Layers, BoxSelect, Terminal, Binary, Braces,
  ArrowRight, ChevronDown, Sparkles, Code2, Shield, Globe,
} from 'lucide-react'
import OrbCanvas from './components/OrbCanvas'

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

const features = [
  { icon: Code2, label: 'Client-Side', desc: 'Zero dados enviados ao servidor. Tudo roda no seu browser.' },
  { icon: Shield, label: 'Privacidade Total', desc: 'Nenhum dado é coletado, armazenado ou transmitido.' },
  { icon: Globe, label: 'Sempre Disponível', desc: '7 ferramentas prontas para uso, sem login ou instalação.' },
]

function useMousePosition() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMove = useCallback((e: MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 2)
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
  }, [mouseX, mouseY])
  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])
  return { mouseX, mouseY }
}

function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6)
      cursorY.set(e.clientY - 6)
      setTimeout(() => { trailX.set(e.clientX - 16); trailY.set(e.clientY - 16) }, 80)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovered(!!(t.closest('a') || t.closest('button')))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          x: cursorX, y: cursorY,
          width: hovered ? 14 : 12, height: hovered ? 14 : 12,
          background: hovered ? '#a855f7' : '#4f8eff',
          boxShadow: hovered ? '0 0 12px #a855f7' : '0 0 8px #4f8eff',
          transition: 'width 0.15s, height 0.15s, background 0.15s',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{
          x: trailX, y: trailY,
          width: hovered ? 40 : 32, height: hovered ? 40 : 32,
          borderColor: hovered ? 'rgba(168,85,247,0.5)' : 'rgba(79,142,255,0.4)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s',
        }}
      />
    </>
  )
}

function Navbar({ scrolled }: { scrolled: boolean }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(8,8,12,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(28,28,40,0.8)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4f8eff, #a855f7)',
              boxShadow: '0 0 16px rgba(79,142,255,0.4)',
            }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg font-syne text-text tracking-tight">DevKit</span>
        </div>

        <Link
          href="/readme"
          className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-text transition-all duration-200"
          style={{
            background: 'rgba(79,142,255,0.1)',
            border: '1px solid rgba(79,142,255,0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(79,142,255,0.18)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(79,142,255,0.25)'
            e.currentTarget.style.borderColor = 'rgba(79,142,255,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(79,142,255,0.1)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = 'rgba(79,142,255,0.25)'
          }}
        >
          Ver Tools
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.nav>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function HeroSection({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background radial glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '-5%', width: '45vw', height: '45vw',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', right: '-5%', width: '40vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(79,142,255,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', left: '30%', width: '30vw', height: '30vw',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />


      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-8 items-center" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        {/* Left — Text content */}
        <div className="flex flex-col items-start">
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 text-xs font-semibold tracking-wide"
            style={{
              background: 'rgba(168,85,247,0.1)',
              border: '1px solid rgba(168,85,247,0.3)',
              color: '#c084fc',
            }}
          >
            <Sparkles className="w-3 h-3" />
            7 Ferramentas · Open Source · Gratuito
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="font-black font-syne leading-[0.88] tracking-tight text-text mb-6"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            Ferramentas
            <br />
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #818cf8 35%, #4f8eff 65%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              para devs
            </span>
            <br />
            modernos.
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-base lg:text-lg leading-relaxed mb-10 max-w-lg"
            style={{ color: '#8888a8' }}
          >
            Um kit completo de utilidades para desenvolvedores. READMEs, paletas,
            gradientes, sombras, regex e mais — tudo client-side, sem login, sem dados coletados.
          </motion.p>

          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary CTA */}
            <Link
              href="/tools"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white text-sm overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f8eff 60%, #06b6d4 100%)',
                backgroundSize: '200% 200%',
                boxShadow: '0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(79,142,255,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(124,58,237,0.65), 0 0 100px rgba(79,142,255,0.35)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(79,142,255,0.2)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explorar ferramentas
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#8888a8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.color = '#e8e8f0'
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = '#8888a8'
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
            >
              Ver ferramentas
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center gap-8 mt-14"
          >
            {[
              { value: '7', label: 'Ferramentas' },
              { value: '100%', label: 'Client-side' },
              { value: '0', label: 'Dados coletados' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black font-syne text-text">{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#8888a8' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex items-center justify-center relative"
          style={{ transform: 'scale(1.18)', transformOrigin: 'center center' }}
        >
          <OrbCanvas mouseX={mouseX} mouseY={mouseY} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'rgba(136,136,168,0.45)' }} />
        </motion.div>
      </div>
    </section>
  )
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [40, 0])
  return { ref, opacity, y }
}

function FeaturesSection() {
  const { ref, opacity, y } = useScrollReveal()
  return (
    <motion.section ref={ref} style={{ opacity, y }} className="relative py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          background: 'rgba(255,255,255,0.015)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: 'rgba(79,142,255,0.1)',
                    border: '1px solid rgba(79,142,255,0.2)',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#4f8eff' }} />
                </div>
                <div>
                  <div className="font-bold text-sm text-text font-syne mb-1">{f.label}</div>
                  <div className="text-sm leading-relaxed" style={{ color: '#8888a8' }}>{f.desc}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

function ToolCard({
  tool, index, featured = false, wide = false,
}: {
  tool: typeof tools[0]; index: number; featured?: boolean; wide?: boolean
}) {
  const Icon = tool.icon
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.48, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={[
        featured ? 'lg:col-span-2 lg:row-span-2' : '',
        wide ? 'lg:col-span-2' : '',
      ].join(' ')}
      style={{ minHeight: featured ? 300 : undefined }}
    >
      <Link
        href={tool.href}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(10,10,15,0.95)',
          border: '1px solid rgba(255,255,255,0.065)',
          padding: featured ? '2rem' : '1.5rem',
          minHeight: featured ? 300 : 188,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = tool.color + '42'
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = `0 0 0 1px ${tool.color}22, 0 24px 48px rgba(0,0,0,0.45), inset 0 0 80px ${tool.color}07`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.065)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}90, transparent)` }}
        />

        {/* Bottom-right corner glow on hover */}
        <div
          className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at bottom right, ${tool.color}1a 0%, transparent 65%)`,
          }}
        />

        {/* Number badge */}
        <span
          className="absolute top-5 right-5 font-fira text-xs font-bold select-none"
          style={{ color: `${tool.color}35` }}
        >
          {num}
        </span>

        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: `${tool.color}14`,
            border: `1px solid ${tool.color}2a`,
          }}
        >
          <Icon className={featured ? 'w-6 h-6' : 'w-5 h-5'} style={{ color: tool.color }} />
        </div>

        {/* Name row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <span
            className="font-black font-syne text-text group-hover:text-white transition-colors duration-200"
            style={{ fontSize: featured ? '1.2rem' : '0.97rem' }}
          >
            {tool.label}
          </span>
          <span
            className="font-fira text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: `${tool.color}14`,
              color: tool.color,
              border: `1px solid ${tool.color}28`,
            }}
          >
            {tool.tag}
          </span>
        </div>

        {/* Description */}
        <p
          className="leading-relaxed flex-1"
          style={{
            color: '#7878a0',
            fontSize: featured ? '0.875rem' : '0.8rem',
          }}
        >
          {tool.description}
        </p>

        {/* CTA row */}
        <div
          className="flex items-center gap-1.5 mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-250 translate-y-1 group-hover:translate-y-0"
          style={{ color: tool.color }}
        >
          Abrir ferramenta
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </motion.div>
  )
}

function ToolsSection() {
  return (
    <section id="tools" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: 'rgba(168,85,247,0.7)' }} />
              <span
                className="font-fira text-xs font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(168,85,247,0.85)' }}
              >
                Ferramentas
              </span>
            </div>
            <h2
              className="font-black font-syne leading-tight text-text"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.7rem)' }}
            >
              Tudo que você precisa,{' '}
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #c084fc, #818cf8, #4f8eff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                num só lugar.
              </span>
            </h2>
          </div>

          <p
            className="text-sm leading-relaxed max-w-xs lg:text-right"
            style={{ color: '#7878a0' }}
          >
            7 utilitários prontos para uso.<br />Client-side, sem login, sem coleta de dados.
          </p>
        </motion.div>

        {/* ── Bento grid ── */}
        {/*
          4-col desktop layout:
          Row 1: [README 2c 2r] [Colors 1c] [Gradient 1c]
          Row 2: [README cont ] [Shadows 1c] [Regex 1c]
          Row 3: [Base64 2c   ] [JSON 2c              ]
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-auto">
          <ToolCard tool={tools[0]} index={0} featured />
          <ToolCard tool={tools[1]} index={1} />
          <ToolCard tool={tools[2]} index={2} />
          <ToolCard tool={tools[3]} index={3} />
          <ToolCard tool={tools[4]} index={4} />
          <ToolCard tool={tools[5]} index={5} wide />
          <ToolCard tool={tools[6]} index={6} wide />
        </div>

        {/* ── Divider line below grid ── */}
        <div
          className="mt-14 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
        />
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-x-0 h-px top-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }}
      />
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-8 mx-auto"
            style={{
              background: 'linear-gradient(135deg, #7c3aed22, #4f8eff22)',
              border: '1px solid rgba(139,92,246,0.3)',
            }}
          >
            <Zap className="w-6 h-6" style={{ color: '#a855f7' }} />
          </div>

          <h2
            className="font-black font-syne text-text mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Pronto para começar?
          </h2>
          <p className="text-base mb-10 max-w-md mx-auto leading-relaxed" style={{ color: '#8888a8' }}>
            Acesse as ferramentas agora. Sem cadastro, sem custo. Tudo no seu browser.
          </p>

          <Link
            href="/readme"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f8eff, #06b6d4)',
              boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(79,142,255,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
              e.currentTarget.style.boxShadow = '0 0 60px rgba(124,58,237,0.65), 0 0 120px rgba(79,142,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(79,142,255,0.2)'
            }}
          >
            Explorar ferramentas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
      <div
        className="absolute inset-x-0 h-px bottom-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(79,142,255,0.2), transparent)' }}
      />
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 border-t" style={{ borderColor: 'rgba(28,28,40,0.8)' }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f8eff, #a855f7)' }}
          >
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm font-syne text-text">DevKit</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(136,136,168,0.5)' }}>
          © {new Date().getFullYear()} DevKit · Todas as ferramentas são client-side
        </p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const { mouseX, mouseY } = useMousePosition()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="min-h-screen font-syne"
      style={{ background: '#08080c', color: '#e8e8f0', cursor: 'none' }}
    >
      <CustomCursor />
      <Navbar scrolled={scrolled} />
      <HeroSection mouseX={mouseX} mouseY={mouseY} />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
