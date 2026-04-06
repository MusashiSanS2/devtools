'use client'

import { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard } from '../lib/utils'
import { Copy, Heart, Trash2, RotateCcw, Layers } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

type GradientType = 'linear' | 'radial'
type Direction = '0deg' | '45deg' | '90deg' | '135deg' | '180deg' | '225deg' | '270deg' | '315deg'

const DIRECTIONS: { label: string; value: Direction }[] = [
  { label: '↑', value: '0deg' },
  { label: '↗', value: '45deg' },
  { label: '→', value: '90deg' },
  { label: '↘', value: '135deg' },
  { label: '↓', value: '180deg' },
  { label: '↙', value: '225deg' },
  { label: '←', value: '270deg' },
  { label: '↖', value: '315deg' },
]

interface GradientState {
  type: GradientType
  direction: Direction
  colors: string[]
}

const defaultState: GradientState = {
  type: 'linear',
  direction: '135deg',
  colors: ['#4f8eff', '#a855f7'],
}

function buildCSS(g: GradientState): string {
  const stops = g.colors.join(', ')
  if (g.type === 'radial') {
    return `radial-gradient(circle, ${stops})`
  }
  return `linear-gradient(${g.direction}, ${stops})`
}

interface SavedGradient {
  id: string
  css: string
  colors: string[]
  label: string
}

export default function GradientPage() {
  const [state, setState] = useState<GradientState>(defaultState)
  const [saved, setSaved] = useState<SavedGradient[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('devkit-gradients')
      if (stored) setSaved(JSON.parse(stored))
    } catch {}
  }, [])

  const css = buildCSS(state)
  const fullCss = `background: ${css};`

  const saveGradient = () => {
    const newItem: SavedGradient = {
      id: Date.now().toString(),
      css,
      colors: state.colors,
      label: state.colors.join(' → '),
    }
    const updated = [newItem, ...saved].slice(0, 12)
    setSaved(updated)
    localStorage.setItem('devkit-gradients', JSON.stringify(updated))
    toast('Saved to favorites!')
  }

  const deleteGradient = (id: string) => {
    const updated = saved.filter((s) => s.id !== id)
    setSaved(updated)
    localStorage.setItem('devkit-gradients', JSON.stringify(updated))
  }

  const loadGradient = (g: SavedGradient) => {
    setState((prev) => ({ ...prev, colors: g.colors }))
  }

  const addColor = () => {
    if (state.colors.length < 4) {
      setState((p) => ({ ...p, colors: [...p.colors, '#ec4899'] }))
    }
  }

  const removeColor = (i: number) => {
    if (state.colors.length > 2) {
      setState((p) => ({ ...p, colors: p.colors.filter((_, idx) => idx !== i) }))
    }
  }

  const updateColor = (i: number, val: string) => {
    setState((p) => ({ ...p, colors: p.colors.map((c, idx) => idx === i ? val : c) }))
  }

  const Sec = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-0.5 h-4 rounded-full" style={{ background: '#ec4899' }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#ec489999' }}>{title}</span>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="Gradient"
        tag="CSS Generator"
        description="Construa gradientes CSS visualmente com preview em tempo real."
        icon={Layers}
        color="#ec4899"
        index={2}
      />

      <div className="flex-1 min-h-0 flex">
        {/* Left: Controls */}
        <div className="w-[360px] shrink-0 overflow-y-auto p-6 flex flex-col gap-7" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          <section>
            <Sec title="Tipo" />
            <div className="flex gap-2">
              {(['linear', 'radial'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setState((p) => ({ ...p, type: t }))}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize"
                  style={state.type === t
                    ? { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#ec4899' }
                    : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {state.type === 'linear' && (
            <section>
              <Sec title="Direção" />
              <div className="grid grid-cols-8 gap-1.5">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setState((p) => ({ ...p, direction: d.value }))}
                    className="aspect-square rounded-lg text-base font-bold border transition-all"
                    style={state.direction === d.value
                      ? { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#ec4899' }
                      : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <Sec title="Cores" />
            <div className="space-y-3">
              {state.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3">
                  <label
                    className="w-11 h-11 rounded-xl cursor-pointer overflow-hidden shrink-0"
                    style={{ backgroundColor: color, border: '2px solid rgba(255,255,255,0.15)' }}
                  >
                    <input type="color" value={color} onChange={(e) => updateColor(i, e.target.value)} className="opacity-0 w-0 h-0" />
                  </label>
                  <input
                    className="tool-input flex-1 font-fira uppercase"
                    value={color.toUpperCase()}
                    onChange={(e) => updateColor(i, e.target.value)}
                    maxLength={7}
                  />
                  <button onClick={() => removeColor(i)} disabled={state.colors.length <= 2} className="btn-icon text-subtle disabled:opacity-30">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {state.colors.length < 4 && (
                <button onClick={addColor} className="btn-ghost w-full justify-center text-xs mt-1">+ Adicionar cor</button>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: '#ec4899' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#ec489999' }}>CSS Output</span>
              </div>
              <button onClick={() => { copyToClipboard(fullCss); toast('CSS copiado!') }} className="btn-ghost text-xs py-1 px-2.5">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
            </div>
            <pre className="text-xs font-fira rounded-xl p-4 overflow-x-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#22c55e' }}>
              {fullCss}
            </pre>
          </section>

          {saved.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-4 rounded-full" style={{ background: '#ec4899' }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#ec489999' }}>Favoritos</span>
                </div>
                <button onClick={() => { setSaved([]); localStorage.removeItem('devkit-gradients') }} className="btn-icon">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {saved.map((g) => (
                  <div
                    key={g.id}
                    className="group relative aspect-video rounded-xl cursor-pointer overflow-hidden transition-all hover:scale-[1.03]"
                    style={{ background: g.css, border: '1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => loadGradient(g)}
                    title={g.label}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteGradient(g.id) }}
                      className="absolute top-1 right-1 w-5 h-5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col min-h-0 p-6 gap-4">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#ec4899' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#ec489999' }}>Preview</span>
            </div>
            <div className="flex gap-2">
              <button onClick={saveGradient} className="btn-ghost text-xs py-1.5 px-3">
                <Heart className="w-3.5 h-3.5" /> Salvar
              </button>
              <button onClick={() => { copyToClipboard(fullCss); toast('CSS copiado!') }} className="btn-ghost text-xs py-1.5 px-3">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
            </div>
          </div>
          <div
            className="flex-1 rounded-2xl transition-all duration-500"
            style={{ background: css, border: '1px solid rgba(255,255,255,0.06)', minHeight: 200 }}
          />
          <div
            className="shrink-0 h-16 rounded-xl transition-all duration-500"
            style={{ background: css, opacity: 0.35, filter: 'blur(8px)', marginTop: -24 }}
          />
        </div>
      </div>
    </div>
  )
}
