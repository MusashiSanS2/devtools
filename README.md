# DevKit

> A polished, client-side developer toolkit — 7 tools, zero backend, zero auth.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)

## Tools

| Route | Tool | Description |
|-------|------|-------------|
| `/` | **README Generator** | Form-driven README with live markdown preview, badges, copy & download |
| `/colors` | **Color Palette** | Generate harmonic 5-color palettes, lock/unlock, export as CSS vars / Tailwind / JSON |
| `/gradient` | **Gradient Generator** | Linear & radial gradients with direction picker, live preview, localStorage favorites |
| `/shadows` | **Box Shadow Builder** | Multi-layer shadows with per-layer sliders, inset support, live card preview |
| `/regex` | **Regex Tester** | Real-time match highlighting, flag toggles, capture groups, 8 common presets |
| `/base64` | **Base64 Encoder/Decoder** | Encode/decode in real time, URL-safe variant, flip button |
| `/json` | **JSON Formatter** | Format, validate (with error line), minify, indent selector, format/minify in place |

## Stack

- **Next.js 14** — App Router, `output: 'export'` (fully static)
- **TypeScript** — strict mode
- **Tailwind CSS** — custom dark theme (`#08080c` bg)
- **Framer Motion** — route transitions, sidebar animation
- **Lucide React** — icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (Static Export)

```bash
npm run build
```

Output is in the `out/` directory — drop it anywhere (Netlify, Vercel, GitHub Pages, etc).

## Design

- Dark theme: `#08080c` background, not grey
- Accent: `#4f8eff` (blue) with per-tool color variants
- Typography: **Syne** for UI + **Fira Code** for code/inputs
- Each tool has a unique accent color (purple, pink, cyan, orange, green, yellow)
- Mobile responsive — sidebar becomes a hamburger menu

## Author

Made with ❤️ by a senior frontend engineer.
