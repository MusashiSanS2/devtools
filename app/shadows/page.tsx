'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard } from '../lib/utils'
import { Plus, Trash2, Copy, Eye, EyeOff, BoxSelect } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

interface ShadowLayer {
  id: string
  x: number
  y: number
  blur: number
  spread: number
  opacity: number
  color: string
  inset: boolean
  enabled: boolean
}

function defaultLayer(id: string): ShadowLayer {
  return { id, x: 4, y: 4, blur: 12, spread: 0, opacity: 30, color: '#000000', inset: false, enabled: true }
}

function layerToCSS(l: ShadowLayer): string {
  const hex = l.color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const a = (l.opacity / 100).toFixed(2)
  return `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${a})`
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, unit = 'px', onChange }: SliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-subtle">{label}</label>
        <span className="text-xs font-fira text-text">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent-cyan"
      />
    </div>
  )
}

export default function ShadowsPage() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer('1')])
  const [activeId, setActiveId] = useState('1')
  const { toast } = useToast()

  const active = layers.find((l) => l.id === activeId) ?? layers[0]

  const update = (id: string, patch: Partial<ShadowLayer>) => {
    setLayers((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l))
  }

  const addLayer = () => {
    const id = Date.now().toString()
    setLayers((prev) => [...prev, defaultLayer(id)])
    setActiveId(id)
  }

  const removeLayer = (id: string) => {
    if (layers.length === 1) return
    const remaining = layers.filter((l) => l.id !== id)
    setLayers(remaining)
    if (activeId === id) setActiveId(remaining[remaining.length - 1].id)
  }

  const enabledLayers = layers.filter((l) => l.enabled)
  const shadowCSS = enabledLayers.map(layerToCSS).join(',\n  ') || 'none'
  const fullCSS = `box-shadow: ${shadowCSS};`

  const Sec = ({ title, action }: { title: string; action?: ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-4 rounded-full" style={{ background: '#06b6d4' }} />
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#06b6d499' }}>{title}</span>
      </div>
      {action}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="Box Shadow"
        tag="CSS Builder"
        description="Componha sombras CSS multicamadas com editor visual interativo."
        icon={BoxSelect}
        color="#06b6d4"
        index={3}
      />

      <div className="flex-1 min-h-0 flex">
        {/* Left: Controls */}
        <div className="w-[380px] shrink-0 overflow-y-auto p-6 flex flex-col gap-7" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Layers list */}
          <section>
            <Sec title="Camadas" action={
              <button
                onClick={addLayer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            } />
            <div className="space-y-2">
              {layers.map((layer, i) => (
                <div
                  key={layer.id}
                  onClick={() => setActiveId(layer.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all"
                  style={activeId === layer.id
                    ? { background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: layer.color, border: '2px solid rgba(255,255,255,0.2)' }} />
                  <span className="text-sm font-medium flex-1" style={{ color: activeId === layer.id ? '#e8e8f0' : '#8888a8' }}>
                    Layer {i + 1}
                    {layer.inset && <span className="ml-1.5 text-xs" style={{ color: '#06b6d4' }}>(inset)</span>}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); update(layer.id, { enabled: !layer.enabled }) }} className="text-subtle hover:text-text transition-colors">
                    {layer.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-40" />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id) }} disabled={layers.length === 1} className="hover:text-red-400 transition-colors disabled:opacity-20" style={{ color: '#6868a0' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Active layer editor */}
          {active && (
            <section>
              <Sec title="Editar camada" />
              <div className="space-y-5">
                <Slider label="X Offset" value={active.x} min={-50} max={50} onChange={(v) => update(active.id, { x: v })} />
                <Slider label="Y Offset" value={active.y} min={-50} max={50} onChange={(v) => update(active.id, { y: v })} />
                <Slider label="Blur" value={active.blur} min={0} max={100} onChange={(v) => update(active.id, { blur: v })} />
                <Slider label="Spread" value={active.spread} min={-50} max={50} onChange={(v) => update(active.id, { spread: v })} />
                <Slider label="Opacidade" value={active.opacity} min={0} max={100} unit="%" onChange={(v) => update(active.id, { opacity: v })} />

                <div className="flex items-center gap-3">
                  <span className="text-xs flex-1" style={{ color: '#6868a0' }}>Cor</span>
                  <label className="w-10 h-10 rounded-xl cursor-pointer overflow-hidden" style={{ backgroundColor: active.color, border: '2px solid rgba(255,255,255,0.15)' }}>
                    <input type="color" value={active.color} onChange={(e) => update(active.id, { color: e.target.value })} className="opacity-0 w-0 h-0" />
                  </label>
                  <input className="tool-input w-28 font-fira uppercase text-xs" value={active.color.toUpperCase()} onChange={(e) => update(active.id, { color: e.target.value })} maxLength={7} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs flex-1" style={{ color: '#6868a0' }}>Inset</span>
                  <button
                    onClick={() => update(active.id, { inset: !active.inset })}
                    className="relative w-11 h-6 rounded-full transition-colors"
                    style={{ background: active.inset ? '#06b6d4' : 'rgba(255,255,255,0.1)' }}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${active.inset ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* CSS Output */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: '#06b6d4' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#06b6d499' }}>CSS Output</span>
              </div>
              <button onClick={() => { copyToClipboard(fullCSS); toast('CSS copiado!') }} className="btn-ghost text-xs py-1 px-2.5">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
            </div>
            <pre className="text-xs font-fira rounded-xl p-4 overflow-x-auto whitespace-pre-wrap" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#06b6d4' }}>
              {fullCSS}
            </pre>
          </section>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
          <div
            className="w-52 h-52 rounded-3xl flex items-center justify-center transition-all duration-400"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: enabledLayers.map(layerToCSS).join(', ') || 'none',
            }}
          >
            <span className="text-xs font-fira" style={{ color: '#4444607' }}>preview</span>
          </div>
          <p className="text-xs font-fira" style={{ color: '#44445a' }}>
            {enabledLayers.length} camada{enabledLayers.length !== 1 ? 's' : ''} ativa{enabledLayers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
