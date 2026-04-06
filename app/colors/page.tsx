'use client'

import { useState, useCallback } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard, downloadFile, generateHarmonicPalette, hexToRgb, hexToHsl } from '../lib/utils'
import { RefreshCw, Lock, Unlock, Copy, Download, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import ToolPageHeader from '../components/ToolPageHeader'

interface ColorSlot {
  hex: string
  locked: boolean
}

function initPalette(): ColorSlot[] {
  return generateHarmonicPalette().map((hex) => ({ hex, locked: false }))
}

function colorName(hex: string): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  const { h, s, l } = hsl
  if (s < 10) return l > 60 ? 'Light Gray' : l < 40 ? 'Dark Gray' : 'Gray'
  const hues = [
    [0, 'Red'], [30, 'Orange'], [60, 'Yellow'], [90, 'Yellow-Green'],
    [120, 'Green'], [150, 'Teal'], [180, 'Cyan'], [210, 'Sky Blue'],
    [240, 'Blue'], [270, 'Purple'], [300, 'Magenta'], [330, 'Pink'], [360, 'Red'],
  ]
  const name = hues.reduce((prev, curr) => Math.abs(curr[0] as number - h) < Math.abs(prev[0] as number - h) ? curr : prev)[1] as string
  return l > 70 ? `Light ${name}` : l < 35 ? `Dark ${name}` : name
}

export default function ColorsPage() {
  const [palette, setPalette] = useState<ColorSlot[]>(initPalette)
  const { toast } = useToast()

  const regenerate = useCallback(() => {
    const newColors = generateHarmonicPalette()
    setPalette((prev) =>
      prev.map((slot, i) => (slot.locked ? slot : { hex: newColors[i], locked: false }))
    )
  }, [])

  const toggleLock = (i: number) => {
    setPalette((prev) => prev.map((s, idx) => idx === i ? { ...s, locked: !s.locked } : s))
  }

  const copyColor = (hex: string, format: 'hex' | 'rgb' | 'hsl') => {
    let value = hex
    if (format === 'rgb') {
      const rgb = hexToRgb(hex)
      if (rgb) value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    } else if (format === 'hsl') {
      const hsl = hexToHsl(hex)
      if (hsl) value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    copyToClipboard(value)
    toast(`Copied ${value}`)
  }

  const exportPalette = (format: 'css' | 'tailwind' | 'json') => {
    const colors = palette.map((s) => s.hex)
    let content = ''
    let filename = 'palette'
    let type = 'text/plain'

    if (format === 'css') {
      content = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`
      filename = 'palette.css'
    } else if (format === 'tailwind') {
      content = `// tailwind.config.js colors\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors.map((c, i) => `        color${i + 1}: '${c}',`).join('\n')}\n      },\n    },\n  },\n}`
      filename = 'tailwind-colors.js'
    } else {
      content = JSON.stringify({ colors: colors.map((c, i) => ({ name: `color${i + 1}`, hex: c })) }, null, 2)
      filename = 'palette.json'
      type = 'application/json'
    }

    downloadFile(content, filename, type)
    toast(`Exported as ${format.toUpperCase()}`)
  }

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="Color Palette"
        tag="Generator"
        description="Crie e exporte paletas de cores harmônicas em CSS, Tailwind ou JSON."
        icon={Palette}
        color="#a855f7"
        index={1}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={regenerate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)', color: '#a855f7' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.15)')}
          >
            <RefreshCw className="w-4 h-4" />
            Gerar
          </button>
          <span className="text-xs" style={{ color: '#6868a0' }}>Clique para travar antes de gerar</span>
        </div>
        <div className="flex gap-2">
          {(['css', 'tailwind', 'json'] as const).map((f) => (
            <button
              key={f}
              onClick={() => exportPalette(f)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#e8e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#6868a0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <Download className="w-3.5 h-3.5" />
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Palette strips */}
      <div className="flex-1 flex gap-3 min-h-0 p-5 pb-4">
        {palette.map((slot, i) => {
          const rgb = hexToRgb(slot.hex)
          const hsl = hexToHsl(slot.hex)
          const isLight = hsl ? hsl.l > 60 : false
          return (
            <motion.div
              key={i}
              layout
              className="flex-1 flex flex-col rounded-2xl overflow-hidden cursor-pointer group"
              style={{ backgroundColor: slot.hex, border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => toggleLock(i)}
            >
              <div className="flex-1 flex items-start justify-between p-4">
                <span className={`text-xs font-bold font-syne ${isLight ? 'text-black/70' : 'text-white/60'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    slot.locked
                      ? 'bg-black/30 text-white opacity-100'
                      : 'bg-black/20 text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {slot.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="p-4 bg-black/25 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <p className={`text-xs font-semibold mb-3 font-syne ${isLight ? 'text-black/80' : 'text-white/90'}`}>
                  {colorName(slot.hex)}
                </p>
                {[
                  { label: 'HEX', value: slot.hex.toUpperCase() },
                  { label: 'RGB', value: rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : '' },
                  { label: 'HSL', value: hsl ? `${hsl.h}° ${hsl.s}% ${hsl.l}%` : '' },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => copyColor(slot.hex, label.toLowerCase() as 'hex' | 'rgb' | 'hsl')}
                    className={`w-full flex items-center justify-between mb-1.5 px-2.5 py-1.5 rounded-lg text-xs font-fira transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      isLight ? 'bg-black/10 text-black/80 hover:bg-black/20' : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <span className="font-bold font-syne text-[10px] tracking-wider">{label}</span>
                    <span className="flex items-center gap-1.5">
                      {value}
                      <Copy className="w-2.5 h-2.5 opacity-50" />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Palette bar */}
      <div className="shrink-0 px-5 pb-5">
        <div className="flex rounded-xl overflow-hidden h-10" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {palette.map((slot, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer hover:scale-y-110 transition-transform origin-bottom"
              style={{ backgroundColor: slot.hex }}
              title={slot.hex}
              onClick={() => { copyToClipboard(slot.hex); toast(`Copiado ${slot.hex}`) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
