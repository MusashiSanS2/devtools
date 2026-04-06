'use client'

import { useState } from 'react'
import { useToast } from '../components/Toast'
import { copyToClipboard, downloadFile } from '../lib/utils'
import { Copy, Download, Plus, X, FileText } from 'lucide-react'
import ToolPageHeader from '../components/ToolPageHeader'

const LICENSES = ['MIT', 'Apache 2.0', 'GPL v3', 'BSD 2-Clause', 'BSD 3-Clause', 'ISC', 'Unlicense', 'WTFPL']
const BADGE_TEMPLATES: Record<string, (v: string) => string> = {
  github: (repo) => `![GitHub](https://img.shields.io/github/license/${repo})`,
  npm: (pkg) => `![npm](https://img.shields.io/npm/v/${pkg})`,
  build: (repo) => `![Build](https://img.shields.io/github/actions/workflow/status/${repo}/ci.yml)`,
  stars: (repo) => `![Stars](https://img.shields.io/github/stars/${repo}?style=social)`,
}

interface FormState {
  name: string
  description: string
  stack: string[]
  features: string
  install: string
  usage: string
  license: string
  author: string
  githubRepo: string
  npmPackage: string
  badges: string[]
}

const defaultForm: FormState = {
  name: '',
  description: '',
  stack: [],
  features: '',
  install: 'npm install',
  usage: '',
  license: 'MIT',
  author: '',
  githubRepo: '',
  npmPackage: '',
  badges: [],
}

function generateMarkdown(form: FormState): string {
  const lines: string[] = []

  const activeBadges = form.badges.map((b) => {
    if (b === 'github' && form.githubRepo) return BADGE_TEMPLATES.github(form.githubRepo)
    if (b === 'npm' && form.npmPackage) return BADGE_TEMPLATES.npm(form.npmPackage)
    if (b === 'build' && form.githubRepo) return BADGE_TEMPLATES.build(form.githubRepo)
    if (b === 'stars' && form.githubRepo) return BADGE_TEMPLATES.stars(form.githubRepo)
    return null
  }).filter(Boolean)

  lines.push(`# ${form.name || 'Project Name'}`)
  lines.push('')
  if (activeBadges.length) {
    lines.push(activeBadges.join(' '))
    lines.push('')
  }
  lines.push(`> ${form.description || 'A short project description.'}`)
  lines.push('')

  if (form.stack.length) {
    lines.push('## Tech Stack')
    lines.push('')
    lines.push(form.stack.map((s) => `![${s}](https://img.shields.io/badge/${encodeURIComponent(s)}-informational?style=flat-square)`).join(' '))
    lines.push('')
  }

  if (form.features.trim()) {
    lines.push('## Features')
    lines.push('')
    form.features.split('\n').filter(Boolean).forEach((f) => {
      lines.push(`- ${f.replace(/^[-*]\s*/, '')}`)
    })
    lines.push('')
  }

  lines.push('## Getting Started')
  lines.push('')
  lines.push('### Installation')
  lines.push('')
  lines.push('```bash')
  lines.push(form.install || 'npm install')
  lines.push('```')
  lines.push('')

  if (form.usage.trim()) {
    lines.push('### Usage')
    lines.push('')
    lines.push('```bash')
    lines.push(form.usage)
    lines.push('```')
    lines.push('')
  }

  lines.push('## License')
  lines.push('')
  lines.push(`This project is licensed under the **${form.license}** License.`)
  lines.push('')

  if (form.author) {
    lines.push('## Author')
    lines.push('')
    lines.push(`Made with ❤️ by **${form.author}**`)
    lines.push('')
    if (form.githubRepo) {
      lines.push(`[GitHub](https://github.com/${form.githubRepo})`)
    }
  }

  return lines.join('\n')
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-text font-syne mb-3">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-text font-syne mt-5 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-subtle mt-4 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text">$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent-blue/40 pl-3 text-subtle italic">$1</blockquote>')
    .replace(/```bash\n([\s\S]*?)```/gm, '<pre class="bg-bg border border-border rounded-lg p-3 text-xs font-fira text-accent-green overflow-x-auto my-2"><code>$1</code></pre>')
    .replace(/```([\s\S]*?)```/gm, '<pre class="bg-bg border border-border rounded-lg p-3 text-xs font-fira text-text overflow-x-auto my-2"><code>$1</code></pre>')
    .replace(/`(.+?)`/g, '<code class="bg-bg border border-border px-1 py-0.5 rounded text-accent-blue text-xs font-fira">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-subtle text-sm ml-4 list-disc">$1</li>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block h-5 mr-1" onerror="this.style.display=\'none\'" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent-blue hover:underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '<div class="my-2"></div>')
}

export default function ReadmePage() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [stackInput, setStackInput] = useState('')
  const { toast } = useToast()

  const markdown = generateMarkdown(form)

  const set = (key: keyof FormState, value: string) => setForm((p) => ({ ...p, [key]: value }))

  const addStack = () => {
    const val = stackInput.trim()
    if (val && !form.stack.includes(val)) {
      setForm((p) => ({ ...p, stack: [...p.stack, val] }))
    }
    setStackInput('')
  }

  const removeStack = (s: string) => setForm((p) => ({ ...p, stack: p.stack.filter((x) => x !== s) }))

  const toggleBadge = (b: string) => {
    setForm((p) => ({
      ...p,
      badges: p.badges.includes(b) ? p.badges.filter((x) => x !== b) : [...p.badges, b],
    }))
  }

  const Lbl = ({ children }: { children: string }) => (
    <label className="block text-xs font-medium mb-2" style={{ color: '#6868a0' }}>{children}</label>
  )

  const Sec = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-0.5 h-4 rounded-full" style={{ background: '#4f8eff' }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4f8eff99' }}>{title}</span>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <ToolPageHeader
        label="README Generator"
        tag="Generator"
        description="Gere READMEs bonitos e profissionais para seus projetos em segundos."
        icon={FileText}
        color="#4f8eff"
        index={0}
      />

      <div className="flex-1 min-h-0 flex">
        {/* ── Left: Form ─────────────────────────────────── */}
        <div className="w-[400px] shrink-0 overflow-y-auto p-7 flex flex-col gap-9" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Project */}
          <section>
            <Sec title="Projeto" />
            <div className="space-y-4">
              <div>
                <Lbl>Nome do projeto</Lbl>
                <input className="tool-input" placeholder="my-awesome-project" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </div>
              <div>
                <Lbl>Descrição</Lbl>
                <textarea className="tool-input resize-none" rows={3} placeholder="Uma breve descrição do projeto" value={form.description} onChange={(e) => set('description', e.target.value)} />
              </div>
              <div>
                <Lbl>Autor</Lbl>
                <input className="tool-input" placeholder="username" value={form.author} onChange={(e) => set('author', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Lbl>GitHub</Lbl>
                  <input className="tool-input" placeholder="user/repo" value={form.githubRepo} onChange={(e) => set('githubRepo', e.target.value)} />
                </div>
                <div>
                  <Lbl>npm</Lbl>
                  <input className="tool-input" placeholder="package-name" value={form.npmPackage} onChange={(e) => set('npmPackage', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <Sec title="Tech Stack" />
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="tool-input flex-1"
                  placeholder="React, TypeScript… (Enter)"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addStack()}
                />
                <button onClick={addStack} className="btn-ghost px-3">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.stack.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(79,142,255,0.1)', border: '1px solid rgba(79,142,255,0.25)', color: '#4f8eff' }}>
                      {s}
                      <button onClick={() => removeStack(s)} className="opacity-60 hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Features */}
          <section>
            <Sec title="Features" />
            <textarea
              className="tool-input resize-none"
              rows={5}
              placeholder={`Uma feature por linha\n- Rápido e leve\n- Suporte a TypeScript`}
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
            />
          </section>

          {/* Commands */}
          <section>
            <Sec title="Comandos" />
            <div className="space-y-4">
              <div>
                <Lbl>Install</Lbl>
                <input className="tool-input font-fira" placeholder="npm install" value={form.install} onChange={(e) => set('install', e.target.value)} />
              </div>
              <div>
                <Lbl>Usage</Lbl>
                <input className="tool-input font-fira" placeholder="npm run dev" value={form.usage} onChange={(e) => set('usage', e.target.value)} />
              </div>
            </div>
          </section>

          {/* License */}
          <section>
            <Sec title="Licença & Badges" />
            <div className="space-y-4">
              <div>
                <Lbl>Licença</Lbl>
                <select className="tool-input" value={form.license} onChange={(e) => set('license', e.target.value)}>
                  {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <Lbl>Badges</Lbl>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(BADGE_TEMPLATES).map((b) => (
                    <button
                      key={b}
                      onClick={() => toggleBadge(b)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all font-medium ${
                        form.badges.includes(b)
                          ? 'border-[#4f8eff55] text-[#4f8eff]'
                          : 'border-white/[0.07] text-[#6868a0] hover:border-white/20 hover:text-[#e8e8f0]'
                      }`}
                      style={form.badges.includes(b) ? { background: 'rgba(79,142,255,0.1)' } : { background: 'transparent' }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Right: Preview ─────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-7 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-4 rounded-full" style={{ background: '#4f8eff' }} />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4f8eff99' }}>Preview</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { copyToClipboard(markdown); toast('Markdown copiado!') }}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </button>
              <button
                onClick={() => { downloadFile(markdown, `${form.name || 'README'}.md`); toast('Download!') }}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                <Download className="w-3.5 h-3.5" />
                .md
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-y-auto px-10 py-8 text-sm leading-relaxed prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        </div>
      </div>
    </div>
  )
}
