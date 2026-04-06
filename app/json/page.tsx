'use client'

import { useState, useMemo } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard } from '../lib/utils'
import { Copy, Minimize2, Maximize2, Trash2, Braces } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

const SAMPLE_JSON = `{
  "name": "DevKit",
  "version": "1.0.0",
  "tools": [
    "readme",
    "colors",
    "gradient",
    "shadows",
    "regex",
    "base64",
    "json"
  ],
  "config": {
    "theme": "dark",
    "accent": "#4f8eff",
    "static": true
  }
}`

export default function JsonPage() {
  const [input, setInput] = useState(SAMPLE_JSON)
  const [indent, setIndent] = useState(2)
  const { toast } = useToast()

  const result = useMemo(() => {
    if (!input.trim()) return { formatted: '', minified: '', error: null, line: null }
    try {
      const parsed = JSON.parse(input)
      return {
        formatted: JSON.stringify(parsed, null, indent),
        minified: JSON.stringify(parsed),
        error: null,
        line: null,
      }
    } catch (e) {
      const err = e as Error
      const lineMatch = err.message.match(/line (\d+)/i)
      const posMatch = err.message.match(/position (\d+)/i)
      return {
        formatted: '',
        minified: '',
        error: err.message,
        line: lineMatch ? parseInt(lineMatch[1]) : posMatch ? null : null,
      }
    }
  }, [input, indent])

  const isValid = !result.error && input.trim().length > 0
  const isEmpty = !input.trim()

  const copyFormatted = () => {
    if (result.formatted) { copyToClipboard(result.formatted); toast('Formatted JSON copied!') }
  }
  const copyMinified = () => {
    if (result.minified) { copyToClipboard(result.minified); toast('Minified JSON copied!') }
  }

  const lineCount = input.split('\n').length

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="JSON Formatter"
        tag="Formatter"
        description="Formate, valide e minifique JSON com código de cores e feedback instantâneo."
        icon={Braces}
        color="#eab308"
        index={6}
      />

      {/* Status + Controls bar */}
      <div className="flex items-center gap-4 px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={isEmpty
            ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#44445a' }
            : isValid
            ? { background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)', color: '#eab308' }
            : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
          }
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: isEmpty ? '#33334a' : isValid ? '#eab308' : '#f87171' }}
          />
          {isEmpty ? 'Aguardando input' : isValid ? 'JSON válido' : 'JSON inválido'}
          {result.error && <span className="ml-1 font-fira font-normal opacity-80 truncate max-w-xs">{result.error}</span>}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs" style={{ color: '#44445a' }}>Indent</span>
          <div className="flex gap-1">
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className="w-8 h-7 rounded-lg text-xs font-fira font-bold transition-all"
                style={indent === n
                  ? { background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.4)', color: '#eab308' }
                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setInput(result.formatted); toast('Formatado!') }}
          disabled={!isValid}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
          style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8', background: 'transparent' }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#e8e8f0' } }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#8888a8' }}
        >
          <Maximize2 className="w-3.5 h-3.5" /> Formatar
        </button>
        <button
          onClick={() => { setInput(result.minified); toast('Minificado!') }}
          disabled={!isValid}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
          style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8', background: 'transparent' }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#e8e8f0' } }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#8888a8' }}
        >
          <Minimize2 className="w-3.5 h-3.5" /> Minificar
        </button>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col min-h-0" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#eab308' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#eab30899' }}>Input</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-fira" style={{ color: '#44445a' }}>{lineCount} linhas</span>
              <button onClick={() => setInput('')} className="btn-icon"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <textarea
            className="flex-1 bg-transparent p-6 text-sm font-fira outline-none resize-none leading-relaxed"
            style={{ color: '#c8c8e0' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Cole seu JSON aqui..."
            spellCheck={false}
          />
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Formatted */}
          <div className="flex-1 flex flex-col min-h-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: '#eab308' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#eab30899' }}>Formatado</span>
              </div>
              <button onClick={copyFormatted} disabled={!isValid} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30" style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8' }}>
                <Copy className="w-3.5 h-3.5" /> Copiar
              </button>
            </div>
            <pre
              className="flex-1 overflow-auto p-6 text-xs font-fira leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: isValid ? '#e8e8f0' : result.error ? '#f87171' : '#44445a' }}
            >
              {isValid ? result.formatted : result.error ?? 'Output formatado aparecerá aqui'}
            </pre>
          </div>

          {/* Minified */}
          <div className="shrink-0 flex flex-col" style={{ maxHeight: '28%' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: '#eab308' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#eab30899' }}>Minificado</span>
              </div>
              <div className="flex items-center gap-3">
                {isValid && result.formatted.length > 0 && (
                  <span className="text-xs font-fira" style={{ color: '#eab308' }}>
                    {Math.round((1 - result.minified.length / result.formatted.length) * 100)}% menor
                  </span>
                )}
                <button onClick={copyMinified} disabled={!isValid} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30" style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8' }}>
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </button>
              </div>
            </div>
            <div
              className="overflow-auto px-6 py-4 text-xs font-fira break-all leading-relaxed"
              style={{ color: isValid ? '#eab308' : '#44445a' }}
            >
              {isValid ? result.minified : <span style={{ fontStyle: 'italic' }}>Minificado aparecerá aqui</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
