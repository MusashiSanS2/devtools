'use client'

import { useState, useCallback } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard } from '../lib/utils'
import { ArrowLeftRight, Copy, Trash2, Binary } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

type Mode = 'encode' | 'decode'
type Variant = 'standard' | 'urlsafe'

function encodeBase64(input: string, urlSafe: boolean): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)))
    if (urlSafe) return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    return encoded
  } catch {
    return '[Invalid input for encoding]'
  }
}

function decodeBase64(input: string, urlSafe: boolean): string {
  try {
    let normalized = input.trim()
    if (urlSafe) {
      normalized = normalized.replace(/-/g, '+').replace(/_/g, '/')
      while (normalized.length % 4 !== 0) normalized += '='
    }
    return decodeURIComponent(escape(atob(normalized)))
  } catch {
    return '[Invalid Base64 string]'
  }
}

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode')
  const [variant, setVariant] = useState<Variant>('standard')
  const [input, setInput] = useState('')
  const { toast } = useToast()

  const isUrlSafe = variant === 'urlsafe'

  const output = useCallback(() => {
    if (!input.trim()) return ''
    if (mode === 'encode') return encodeBase64(input, isUrlSafe)
    return decodeBase64(input, isUrlSafe)
  }, [input, mode, isUrlSafe])

  const result = output()

  const flip = () => {
    setInput(result)
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
  }

  const inputLabel = mode === 'encode' ? 'Plain Text' : 'Base64 String'
  const outputLabel = mode === 'encode' ? 'Base64 Output' : 'Decoded Text'

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="Base64"
        tag="Encode / Decode"
        description="Codifique e decodifique texto em Base64 padrão ou URL-safe."
        icon={Binary}
        color="#22c55e"
        index={5}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex gap-2">
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all capitalize"
              style={mode === m
                ? { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
              }
            >
              {m}
            </button>
          ))}
        </div>

        <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex gap-2">
          {(['standard', 'urlsafe'] as Variant[]).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className="px-3 py-2 rounded-lg text-xs font-medium border transition-all"
              style={variant === v
                ? { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e' }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
              }
            >
              {v === 'standard' ? 'Standard' : 'URL-safe'}
            </button>
          ))}
        </div>

        <button
          onClick={flip}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8', background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#e8e8f0' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#8888a8' }}
        >
          <ArrowLeftRight className="w-4 h-4" />
          Inverter
        </button>

        {input && result && !result.startsWith('[Invalid') && (
          <span className="text-xs font-fira" style={{ color: '#22c55e' }}>
            {mode === 'encode'
              ? `${((result.length / input.length) * 100).toFixed(0)}% do tamanho original`
              : `${((input.length / result.length) * 100).toFixed(0)}% comprimido`}
          </span>
        )}
      </div>

      {/* Two columns */}
      <div className="flex-1 min-h-0 flex">
        {/* Input */}
        <div className="flex-1 flex flex-col min-h-0" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#22c55e' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#22c55e99' }}>{inputLabel}</span>
            </div>
            <button onClick={() => setInput('')} className="btn-icon">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            className="flex-1 bg-transparent p-6 text-sm font-fira outline-none resize-none leading-relaxed"
            style={{ color: '#c8c8e0' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Digite ou cole o texto para codificar...' : 'Cole a string Base64 para decodificar...'}
            spellCheck={false}
          />
          <div className="px-6 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs font-fira" style={{ color: '#44445a' }}>{input.length} chars</span>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#22c55e' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#22c55e99' }}>{outputLabel}</span>
            </div>
            <button
              onClick={() => { copyToClipboard(result); toast('Copiado!') }}
              disabled={!result}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30"
              style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8', background: 'transparent' }}
            >
              <Copy className="w-3.5 h-3.5" /> Copiar
            </button>
          </div>
          <div
            className="flex-1 overflow-auto p-6 text-sm font-fira leading-relaxed whitespace-pre-wrap break-all"
            style={{ color: result.startsWith('[Invalid') ? '#f87171' : '#22c55e' }}
          >
            {result || <span style={{ color: '#44445a', fontStyle: 'italic' }}>Output aparecerá aqui...</span>}
          </div>
          <div className="px-6 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs font-fira" style={{ color: '#44445a' }}>{result.length} chars</span>
          </div>
        </div>
      </div>
    </div>
  )
}
