'use client'

import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard } from '../lib/utils'
import { Copy, Terminal } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

const FLAGS = [
  { flag: 'g', label: 'global', desc: 'Find all matches' },
  { flag: 'i', label: 'ignore case', desc: 'Case insensitive' },
  { flag: 'm', label: 'multiline', desc: '^ and $ match line boundaries' },
  { flag: 's', label: 'dotAll', desc: '. matches newline' },
  { flag: 'u', label: 'unicode', desc: 'Unicode mode' },
]

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)' },
  { label: 'CPF', pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}' },
  { label: 'Phone BR', pattern: '\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}' },
  { label: 'IPv4', pattern: '\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b' },
  { label: 'HEX Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b' },
  { label: 'Date (DD/MM/YYYY)', pattern: '\\b(0?[1-9]|[12]\\d|3[01])/(0?[1-9]|1[0-2])/(\\d{4})\\b' },
  { label: 'Postal Code BR', pattern: '\\d{5}-?\\d{3}' },
]

const TEST_TEXT = `Hello world! Contact us at support@example.com or admin@test.org
Visit https://www.example.com or http://api.test.io/docs
CPF: 123.456.789-09 | Phone: (11) 98765-4321
Hex color: #4f8eff and #abc | IPv4: 192.168.1.100
Date: 25/12/2024 | CEP: 01310-100`

export default function RegexPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState<string[]>(['g'])
  const [testText, setTestText] = useState(TEST_TEXT)
  const { toast } = useToast()

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  const result = useMemo(() => {
    if (!pattern) return { matches: [], groups: [], error: null, highlighted: testText }
    try {
      const regex = new RegExp(pattern, flags.join(''))
      const matches: RegExpExecArray[] = []

      if (flags.includes('g')) {
        let m: RegExpExecArray | null
        const safeCopy = new RegExp(pattern, flags.join(''))
        while ((m = safeCopy.exec(testText)) !== null) {
          matches.push(m)
          if (m[0].length === 0) safeCopy.lastIndex++
        }
      } else {
        const m = regex.exec(testText)
        if (m) matches.push(m)
      }

      const highlighted = highlightMatches(testText, matches)
      const groups = matches.flatMap((m) =>
        Object.entries(m.groups ?? {}).map(([key, val]) => ({ key, val, match: m[0] }))
          .concat(m.slice(1).filter(Boolean).map((g, i) => ({ key: `$${i + 1}`, val: g ?? '', match: m[0] })))
      )

      return { matches, groups, error: null, highlighted }
    } catch (e) {
      return { matches: [], groups: [], error: (e as Error).message, highlighted: testText }
    }
  }, [pattern, flags, testText])

  function highlightMatches(text: string, matches: RegExpExecArray[]): string {
    if (!matches.length) return escapeHtml(text)
    let result = ''
    let lastIdx = 0
    const sorted = [...matches].sort((a, b) => a.index - b.index)
    for (const m of sorted) {
      if (m.index < lastIdx) continue
      result += escapeHtml(text.slice(lastIdx, m.index))
      result += `<mark class="bg-accent-orange/30 text-accent-orange rounded px-0.5">${escapeHtml(m[0])}</mark>`
      lastIdx = m.index + m[0].length
    }
    result += escapeHtml(text.slice(lastIdx))
    return result
  }

  function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  }

  const flagStr = flags.length ? `/${pattern}/${flags.join('')}` : `/${pattern}/`

  const Sec = ({ title, right }: { title: string; right?: ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-4 rounded-full" style={{ background: '#f97316' }} />
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#f9731699' }}>{title}</span>
      </div>
      {right}
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="Regex Tester"
        tag="Tester"
        description="Teste expressões regulares com destaque visual de matches em tempo real."
        icon={Terminal}
        color="#f97316"
        index={4}
      />

      <div className="flex-1 min-h-0 flex">
        {/* Left: Pattern + Controls */}
        <div className="w-[380px] shrink-0 overflow-y-auto p-6 flex flex-col gap-7" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Pattern input */}
          <section>
            <Sec title="Padrão" />
            <div
              className="flex items-center gap-0 rounded-xl overflow-hidden mb-3"
              style={{ border: result.error ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.05)' }}
            >
              <span className="px-4 text-xl font-fira" style={{ color: '#f97316', opacity: 0.5 }}>/</span>
              <input
                className="flex-1 bg-transparent py-3 text-sm outline-none font-fira"
                style={{ color: '#e8e8f0' }}
                placeholder="[a-z]+"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
              />
              <span className="px-2 text-xl font-fira" style={{ color: '#f97316', opacity: 0.5 }}>/</span>
              <span className="px-3 font-fira font-bold" style={{ color: '#f97316' }}>{flags.join('')}</span>
            </div>
            {result.error && (
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="text-xs font-fira" style={{ color: '#f87171' }}>{result.error}</span>
              </div>
            )}
          </section>

          {/* Flags */}
          <section>
            <Sec title="Flags" />
            <div className="flex flex-wrap gap-2">
              {FLAGS.map(({ flag, label }) => (
                <button
                  key={flag}
                  onClick={() => toggleFlag(flag)}
                  title={FLAGS.find((f) => f.flag === flag)?.desc}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-fira font-medium transition-all"
                  style={flags.includes(flag)
                    ? { background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316' }
                    : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#6868a0' }
                  }
                >
                  <span className="font-bold">{flag}</span>
                  <span className="opacity-60 font-syne text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Presets */}
          <section>
            <Sec title="Padrões comuns" />
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPattern(p.pattern)}
                  className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#8888a8', background: 'rgba(255,255,255,0.02)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; e.currentTarget.style.color = '#e8e8f0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#8888a8' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* Results */}
          <section>
            <Sec
              title="Grupos capturados"
              right={
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: result.matches.length ? '#f97316' : '#44445a' }}>
                    {result.matches.length} match{result.matches.length !== 1 ? 'es' : ''}
                  </span>
                  <button onClick={() => { copyToClipboard(flagStr); toast('Regex copiado!') }} className="btn-ghost text-xs py-1 px-2">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            />
            {result.groups.length > 0 ? (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {result.groups.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-fira">
                    <span className="font-bold" style={{ color: '#f97316' }}>{g.key}</span>
                    <span style={{ color: '#44445a' }}>→</span>
                    <span className="px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8f0' }}>{g.val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: '#44445a' }}>
                {pattern ? (result.matches.length ? 'Sem grupos de captura' : 'Nenhum match encontrado') : 'Digite um padrão para testar'}
              </p>
            )}
          </section>
        </div>

        {/* Right: Test string + highlighted output */}
        <div className="flex-1 flex flex-col min-h-0 p-6 gap-6">
          <section className="flex flex-col gap-3" style={{ flex: '0 0 auto' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full" style={{ background: '#f97316' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#f9731699' }}>String de teste</span>
              </div>
              <span className="text-xs font-fira" style={{ color: '#44445a' }}>{testText.length} chars</span>
            </div>
            <textarea
              className="tool-input resize-none"
              rows={6}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              spellCheck={false}
              placeholder="Cole sua string de teste aqui..."
            />
          </section>

          <section className="flex flex-col flex-1 gap-3 min-h-0">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#f97316' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#f9731699' }}>Matches destacados</span>
            </div>
            <div
              className="flex-1 font-fira text-sm rounded-xl p-5 overflow-y-auto whitespace-pre-wrap break-words leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#c8c8e0', minHeight: 120 }}
              dangerouslySetInnerHTML={{ __html: result.highlighted }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
