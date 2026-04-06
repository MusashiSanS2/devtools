'use client'

import { useRef, useEffect } from 'react'
import { motion, type MotionValue, useSpring, useTransform } from 'framer-motion'

interface OrbCanvasProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

/* ─── Animated orbit dot (pure rAF, zero React re-renders) ─── */
function OrbitDot({
  cx = 240, cy = 240, rx, ry, rotDeg = 0, startAngle = 0,
  color, trailColor, duration, size = 5,
}: {
  cx?: number; cy?: number; rx: number; ry: number; rotDeg?: number
  startAngle?: number; color: string; trailColor: string
  duration: number; size?: number
}) {
  const dotRef = useRef<HTMLDivElement>(null)
  const angle = useRef(startAngle * (Math.PI / 180))

  useEffect(() => {
    const speed = (2 * Math.PI) / (duration * 60)
    const rad = rotDeg * (Math.PI / 180)
    const cosR = Math.cos(rad), sinR = Math.sin(rad)
    let id: number

    const tick = () => {
      angle.current += speed
      const a = angle.current
      const ex = rx * Math.cos(a)
      const ey = ry * Math.sin(a)
      const px = cx + ex * cosR - ey * sinR
      const py = cy + ex * sinR + ey * cosR
      const brightness = 0.4 + 0.6 * ((Math.sin(a) + 1) / 2)
      const scale = 0.7 + 0.6 * brightness
      if (dotRef.current) {
        dotRef.current.style.left = `${px - size / 2}px`
        dotRef.current.style.top = `${py - size / 2}px`
        dotRef.current.style.opacity = String(0.35 + 0.65 * brightness)
        dotRef.current.style.transform = `scale(${scale})`
        dotRef.current.style.boxShadow =
          `0 0 ${size * 2.5}px ${color}, 0 0 ${size * 6}px ${trailColor}`
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [cx, cy, rx, ry, rotDeg, duration, size, color, trailColor])

  return (
    <div
      ref={dotRef}
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, willChange: 'left,top,opacity,transform' }}
    />
  )
}

export default function OrbCanvas({ mouseX, mouseY }: OrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* spring-smoothed parallax */
  const sX = useSpring(mouseX, { stiffness: 32, damping: 26 })
  const sY = useSpring(mouseY, { stiffness: 32, damping: 26 })
  const orbX = useTransform(sX, [-1, 1], [-28, 28])
  const orbY = useTransform(sY, [-1, 1], [-18, 18])

  /* canvas: particles + scan line + pulse rings */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const S = 560
    canvas.width = S; canvas.height = S
    const cx = S / 2, cy = S / 2

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; baseOpacity: number; hue: number; phase: number; speed: number
    }

    const hues = [265, 250, 220, 190, 280, 255]
    const particles: Particle[] = Array.from({ length: 160 }, () => {
      const a = Math.random() * Math.PI * 2
      const r = 100 + Math.random() * 200
      const hue = hues[Math.floor(Math.random() * hues.length)]
      return {
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r * 0.5,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.14,
        size: Math.random() * 1.4 + 0.2,
        baseOpacity: Math.random() * 0.5 + 0.12,
        hue, phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.6,
      }
    })

    /* pulse ring state */
    const rings: { r: number; alpha: number; color: string }[] = []
    let ringTimer = 0
    const ringColors = ['rgba(168,85,247', 'rgba(79,142,255', 'rgba(6,182,212']
    let ringColorIdx = 0

    let t = 0
    let animId: number

    const render = () => {
      t += 0.008
      ctx.clearRect(0, 0, S, S)

      /* ── pulse rings ── */
      ringTimer++
      if (ringTimer > 90) {
        ringTimer = 0
        rings.push({ r: 104, alpha: 0.7, color: ringColors[ringColorIdx % ringColors.length] })
        ringColorIdx++
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i]
        ring.r += 1.8
        ring.alpha -= 0.011
        if (ring.alpha <= 0) { rings.splice(i, 1); continue }
        ctx.beginPath()
        ctx.ellipse(cx, cy, ring.r, ring.r * 0.38, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `${ring.color},${ring.alpha})`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }

      /* ── scan line sweeping across sphere ── */
      const scanY = cy - 100 + ((t * 28) % 200)
      const scanGrd = ctx.createLinearGradient(cx - 110, scanY, cx + 110, scanY + 3)
      scanGrd.addColorStop(0, 'rgba(168,85,247,0)')
      scanGrd.addColorStop(0.35, 'rgba(168,85,247,0.28)')
      scanGrd.addColorStop(0.5, 'rgba(192,132,252,0.55)')
      scanGrd.addColorStop(0.65, 'rgba(168,85,247,0.28)')
      scanGrd.addColorStop(1, 'rgba(168,85,247,0)')
      ctx.fillStyle = scanGrd
      ctx.fillRect(cx - 110, scanY, 220, 2.5)

      /* ── particles ── */
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        const dx = p.x - cx, dy = p.y - cy
        const dNorm = Math.sqrt(dx * dx + (dy / 0.5) * (dy / 0.5))
        if (dNorm > 280) { p.vx -= dx * 0.0005; p.vy -= dy * 0.0003 }
        if (dNorm < 90) { p.vx += dx * 0.002; p.vy += dy * 0.001 }

        const op = p.baseOpacity * (0.5 + 0.5 * Math.sin(t * p.speed + p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},88%,74%,${op})`
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(animId)
  }, [])

  const C = 280 /* canvas center */

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{ width: 560, height: 560 }}
    >
      {/* Particle / FX canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: 560, height: 560, mixBlendMode: 'screen' }}
      />

      {/* ── SVG: orbit ellipses + meridian arcs ── */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="560" height="560"
        viewBox="0 0 560 560"
        style={{ overflow: 'visible' }}
      >
        {/* Orbit rings */}
        {[
          { rx: 210, ry: 56,  rot: 0,   stroke: 'rgba(168,85,247,0.28)',  sw: 1   },
          { rx: 232, ry: 62,  rot: 52,  stroke: 'rgba(79,142,255,0.22)',  sw: 0.8 },
          { rx: 188, ry: 50,  rot: -35, stroke: 'rgba(6,182,212,0.24)',   sw: 0.8 },
          { rx: 255, ry: 70,  rot: 22,  stroke: 'rgba(139,92,246,0.14)',  sw: 0.6 },
          { rx: 168, ry: 44,  rot: -62, stroke: 'rgba(99,179,237,0.16)',  sw: 0.6 },
        ].map((r, i) => (
          <ellipse key={i}
            cx={C} cy={C} rx={r.rx} ry={r.ry}
            fill="none" stroke={r.stroke} strokeWidth={r.sw}
            transform={`rotate(${r.rot} ${C} ${C})`}
          />
        ))}

        {/* Equator accent */}
        <ellipse cx={C} cy={C} rx={132} ry={34}
          fill="none"
          stroke="rgba(192,132,252,0.25)"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
      </svg>

      {/* ── Orbit dots ── */}
      <div className="absolute inset-0" style={{ overflow: 'visible' }}>
        <OrbitDot cx={C} cy={C} rx={210} ry={56}  rotDeg={0}   startAngle={0}   color="#c084fc" trailColor="rgba(168,85,247,0.4)"  duration={10} size={6} />
        <OrbitDot cx={C} cy={C} rx={232} ry={62}  rotDeg={52}  startAngle={180} color="#4f8eff" trailColor="rgba(79,142,255,0.4)"  duration={15} size={5} />
        <OrbitDot cx={C} cy={C} rx={188} ry={50}  rotDeg={-35} startAngle={90}  color="#06b6d4" trailColor="rgba(6,182,212,0.4)"   duration={8}  size={4} />
        <OrbitDot cx={C} cy={C} rx={255} ry={70}  rotDeg={22}  startAngle={270} color="#818cf8" trailColor="rgba(99,102,241,0.35)" duration={20} size={4} />
        <OrbitDot cx={C} cy={C} rx={168} ry={44}  rotDeg={-62} startAngle={45}  color="#67e8f9" trailColor="rgba(6,182,212,0.3)"   duration={6}  size={3} />
      </div>

      {/* ── Orb with mouse parallax ── */}
      <motion.div style={{ x: orbX, y: orbY }} className="relative z-10">

        {/* Outer atmospheric corona */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: -72 }}
          animate={{ opacity: [0.5, 0.75, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-full h-full rounded-full" style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.32) 0%, rgba(79,142,255,0.16) 40%, transparent 68%)',
            filter: 'blur(32px)',
          }} />
        </motion.div>

        {/* Mid glow ring */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: -28,
            background: 'radial-gradient(ellipse at center, rgba(192,132,252,0.18) 0%, transparent 60%)',
            filter: 'blur(14px)',
          }}
        />

        {/* Sphere shell */}
        <motion.div
          className="rounded-full relative overflow-hidden"
          style={{ width: 260, height: 260 }}
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ── Base Phong sphere ── */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(ellipse at 30% 25%,
                rgba(255,235,255,1)    0%,
                rgba(216,152,255,1)    8%,
                rgba(168,85,247,1)     20%,
                rgba(99,102,241,1)     34%,
                rgba(59,130,246,1)     50%,
                rgba(29,78,216,1)      64%,
                rgba(12,20,60,1)       80%,
                rgba(5,8,20,1)         100%
              )`,
              boxShadow: `
                0 0 60px  rgba(192,132,252,0.75),
                0 0 120px rgba(79,142,255,0.5),
                0 0 200px rgba(139,92,246,0.22),
                inset -28px -28px 60px rgba(0,0,0,0.78),
                inset 8px 8px 24px rgba(255,255,255,0.06)
              `,
            }}
          />

          {/* ── Specular highlight — primary ── */}
          <div className="absolute pointer-events-none" style={{
            top: '8%', left: '14%',
            width: '36%', height: '22%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.82) 0%, transparent 100%)',
            filter: 'blur(6px)',
            transform: 'rotate(-18deg)',
            borderRadius: '50%',
          }} />

          {/* ── Specular highlight — secondary ── */}
          <div className="absolute pointer-events-none" style={{
            top: '18%', left: '11%',
            width: '16%', height: '9%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.52) 0%, transparent 100%)',
            filter: 'blur(3px)',
            transform: 'rotate(-30deg)',
            borderRadius: '50%',
          }} />

          {/* ── Cyan rim light (back-scatter) ── */}
          <div className="absolute pointer-events-none" style={{
            bottom: '10%', right: '12%',
            width: '30%', height: '18%',
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.65) 0%, transparent 100%)',
            filter: 'blur(10px)',
            borderRadius: '50%',
          }} />

          {/* ── Blue side rim ── */}
          <div className="absolute pointer-events-none" style={{
            top: '30%', right: '8%',
            width: '18%', height: '40%',
            background: 'radial-gradient(ellipse, rgba(79,142,255,0.38) 0%, transparent 100%)',
            filter: 'blur(8px)',
            borderRadius: '50%',
          }} />

          {/* ── Inner energy core glow ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: '25%', left: '25%', width: '50%', height: '50%',
              background: 'radial-gradient(ellipse, rgba(255,230,255,0.22) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.05, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Equatorial atmosphere ring */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: '50%', left: '-18%',
            width: '136%', height: '28%',
            transform: 'translateY(-50%)',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, rgba(79,142,255,0.12) 45%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      </motion.div>
    </div>
  )
}
