import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

type Particle = {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  r: number
  phase: number
  offsetX: number
  offsetY: number
  displayX?: number
  displayY?: number
}

type Variant = 'landing' | 'technology' | 'project'

type Props = {
  variant?: Variant
}

function InteractiveNetworkBackground({ variant = 'technology' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const reducedMotionRef = useRef(false)
  const stateRef = useRef({
    W: 0,
    H: 0,
    DPR: 1,
    t: 0,
    lastMoveTime: performance.now(),
    mouse: { x: null as number | null, y: null as number | null, active: false },
    magnet: { x: 0, y: 0, active: false, strength: 0 },
    constellation: {
      active: false,
      strength: 0,
      points: [] as Particle[],
      pulse: 0,
    },
  })

  const config = {
    landing: {
      density: 20000,
      minParticles: 24,
      maxParticles: 68,
      linkDist: 150,
      mouseRadius: 180,
      particleGlow: 0.8,
      linkOpacity: 0.18,
      mouseOpacity: 0.28,
      magnetOpacity: 0.18,
      interactionStrength: 9,
      waveAmount: 1.2,
    },
    technology: {
      density: 16000,
      minParticles: 40,
      maxParticles: 140,
      linkDist: 140,
      mouseRadius: 200,
      particleGlow: 1.4,
      linkOpacity: 0.36,
      mouseOpacity: 0.48,
      magnetOpacity: 0.36,
      interactionStrength: 24,
      waveAmount: 6,
    },
    project: {
      density: 18000,
      minParticles: 32,
      maxParticles: 108,
      linkDist: 128,
      mouseRadius: 180,
      particleGlow: 1.05,
      linkOpacity: 0.28,
      mouseOpacity: 0.4,
      magnetOpacity: 0.3,
      interactionStrength: 18,
      waveAmount: 5,
    },
  } as const

  const params = config[variant]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = stateRef.current
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      state.DPR = Math.min(window.devicePixelRatio || 1, 2)
      state.W = window.innerWidth
      state.H = window.innerHeight
      canvas.width = state.W * state.DPR
      canvas.height = state.H * state.DPR
      canvas.style.width = `${state.W}px`
      canvas.style.height = `${state.H}px`
      ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0)
      initParticles()
    }

    const initParticles = () => {
      const density = (state.W * state.H) / params.density
      const count = Math.max(params.minParticles, Math.min(params.maxParticles, Math.round(density)))
      particlesRef.current = []

      for (let i = 0; i < count; i += 1) {
        const particle: Particle = {
          x: Math.random() * state.W,
          y: Math.random() * state.H,
          baseX: 0,
          baseY: 0,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6,
          phase: Math.random() * Math.PI * 2,
          offsetX: 0,
          offsetY: 0,
        }

        particle.baseX = particle.x
        particle.baseY = particle.y
        particlesRef.current.push(particle)
      }
    }

    const syncMagnetTarget = (target: Element | null) => {
      const magnetElement = target?.closest(
        '[data-network-magnet], .tech-card, .portfolio-related-card, .portfolio-card, .card, .skill-card, .project-card, .technology-stage-card, .technology-project-card, .technology-notes-card'
      ) as HTMLElement | null

      if (!magnetElement) {
        state.magnet.active = false
        state.magnet.strength = 0
        return
      }

      const rect = magnetElement.getBoundingClientRect()
      state.magnet.x = rect.left + rect.width / 2
      state.magnet.y = rect.top + rect.height / 2
      state.magnet.active = true
      state.mouse.active = false
      state.mouse.x = null
      state.mouse.y = null
      state.constellation.active = false
      state.constellation.strength = 0
      state.constellation.points = []
    }

    const updatePointer = (x: number, y: number) => {
      state.mouse.x = x
      state.mouse.y = y
      state.mouse.active = true
      state.lastMoveTime = performance.now()
    }

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as Element | null
      if (target && target.closest('[data-network-magnet], .tech-card, .portfolio-related-card, .portfolio-card, .card, .skill-card, .project-card, .technology-stage-card, .technology-project-card, .technology-notes-card')) {
        syncMagnetTarget(target)
        return
      }

      state.magnet.active = false
      state.magnet.strength = 0
      updatePointer(event.clientX, event.clientY)
    }

    const handleMouseLeave = () => {
      state.mouse.active = false
      state.mouse.x = null
      state.mouse.y = null
      state.magnet.active = false
      state.magnet.strength = 0
      state.constellation.active = false
      state.constellation.strength = 0
      state.constellation.points = []
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length) {
        const touch = event.touches[0]
        state.magnet.active = false
        state.magnet.strength = 0
        updatePointer(touch.clientX, touch.clientY)
      }
    }

    const handleTouchEnd = () => {
      state.mouse.active = false
      state.mouse.x = null
      state.mouse.y = null
      state.magnet.active = false
      state.magnet.strength = 0
      state.constellation.active = false
      state.constellation.strength = 0
      state.constellation.points = []
    }

    const pickConstellationPoints = () => {
      if (state.mouse.x === null || state.mouse.y === null) return []

      const withDistance = particlesRef.current
        .map((particle) => {
          const dx = particle.x - state.mouse.x!
          const dy = particle.y - state.mouse.y!
          return {
            particle,
            distance: Math.sqrt(dx * dx + dy * dy),
          }
        })
        .sort((a, b) => a.distance - b.distance)

      return withDistance.slice(0, 7).map((entry) => entry.particle)
    }

    const draw = () => {
      state.t += 0.006
      ctx.clearRect(0, 0, state.W, state.H)

      const particles = particlesRef.current
      const reducedMotion = reducedMotionRef.current
      const motionScale = variant === 'landing' ? 0.42 : 1

      if (!reducedMotion) {
        const idleFor = performance.now() - state.lastMoveTime
        const shouldBeIdle = state.mouse.active && idleFor > 3000 && !state.magnet.active

        if (shouldBeIdle && !state.constellation.active) {
          state.constellation.active = true
          state.constellation.points = pickConstellationPoints()
        }

        if (!shouldBeIdle && state.constellation.active) {
          state.constellation.active = false
          state.constellation.points = []
        }

        if (state.constellation.active) {
          state.constellation.strength += (1 - state.constellation.strength) * 0.08
          state.constellation.pulse = (Math.sin(state.t * 3) + 1) / 2
        } else {
          state.constellation.strength += (0 - state.constellation.strength) * 0.08
        }
      }

      for (const particle of particles) {
        const wave = Math.sin(state.t * 2 + particle.phase) * (reducedMotion ? 0 : params.waveAmount)
        const ambientX = particle.baseX + particle.vx * 60 + Math.cos(state.t + particle.phase) * (reducedMotion ? 0 : 8 * motionScale)
        const ambientY = particle.baseY + particle.vy * 60 + wave * motionScale

        if (!reducedMotion) {
          particle.baseX += particle.vx * motionScale
          particle.baseY += particle.vy * motionScale

          if (particle.baseX < -50) particle.baseX = state.W + 50
          if (particle.baseX > state.W + 50) particle.baseX = -50
          if (particle.baseY < -50) particle.baseY = state.H + 50
          if (particle.baseY > state.H + 50) particle.baseY = -50
        }

        if (state.mouse.active && !state.magnet.active && !reducedMotion) {
          const dx = ambientX - (state.mouse.x ?? particle.x)
          const dy = ambientY - (state.mouse.y ?? particle.y)
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < params.mouseRadius) {
            const force = (1 - distance / params.mouseRadius) * params.interactionStrength
            const angle = Math.atan2(dy, dx)
            particle.offsetX += Math.cos(angle) * force * 0.18 * motionScale
            particle.offsetY += Math.sin(angle) * force * 0.18 * motionScale
          }
        }

        if (state.magnet.active) {
          const dx = state.magnet.x - particle.x
          const dy = state.magnet.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const magnetStrength = Math.min(1, Math.max(0, 1 - distance / 260))
          const pull = magnetStrength * (0.7 + state.magnet.strength * 1.3)
          const safeDistance = Math.max(distance, 48)

          particle.offsetX += (dx / safeDistance) * 18 * pull * motionScale
          particle.offsetY += (dy / safeDistance) * 18 * pull * motionScale
        }

        particle.offsetX *= 0.9
        particle.offsetY *= 0.9

        const targetX = ambientX + particle.offsetX
        const targetY = ambientY + particle.offsetY

        particle.displayX = (particle.displayX ?? targetX) + (targetX - (particle.displayX ?? targetX)) * 0.12
        particle.displayY = (particle.displayY ?? targetY) + (targetY - (particle.displayY ?? targetY)) * 0.12
        particle.x = particle.displayX ?? targetX
        particle.y = particle.displayY ?? targetY

        const maxOffset = 12
        particle.offsetX = Math.max(-maxOffset, Math.min(maxOffset, particle.offsetX))
        particle.offsetY = Math.max(-maxOffset, Math.min(maxOffset, particle.offsetY))
      }

      state.magnet.strength += ((state.magnet.active ? 1 : 0) - state.magnet.strength) * 0.12

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < params.linkDist) {
            const opacity = 1 - distance / params.linkDist
            const mouseBoost = state.mouse.active && !state.magnet.active
              ? (() => {
                  const dxA = a.x - (state.mouse.x ?? a.x)
                  const dyA = a.y - (state.mouse.y ?? a.y)
                  const dA = Math.sqrt(dxA * dxA + dyA * dyA)
                  const dxB = b.x - (state.mouse.x ?? b.x)
                  const dyB = b.y - (state.mouse.y ?? b.y)
                  const dB = Math.sqrt(dxB * dxB + dyB * dyB)
                  if (dA < params.mouseRadius || dB < params.mouseRadius) {
                    return Math.max(0, 1 - Math.min(dA, dB) / params.mouseRadius) * 0.9
                  }
                  return 0
                })()
              : 0

            const finalOpacity = Math.min(1, opacity * params.linkOpacity + mouseBoost * params.mouseOpacity)
            ctx.strokeStyle = `rgba(139, 92, 246, ${finalOpacity})`
            ctx.lineWidth = 0.9
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        if (state.mouse.active && !state.magnet.active) {
          const dx = particles[i].x - (state.mouse.x ?? particles[i].x)
          const dy = particles[i].y - (state.mouse.y ?? particles[i].y)
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < params.mouseRadius) {
            const opacity = 1 - distance / params.mouseRadius
            ctx.strokeStyle = `rgba(236, 73, 153, ${opacity * params.mouseOpacity})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(state.mouse.x ?? particles[i].x, state.mouse.y ?? particles[i].y)
            ctx.stroke()
          }
        }
      }

      if (state.constellation.strength > 0.02 && state.constellation.points.length > 1) {
        const pulse = 0.6 + state.constellation.pulse * 0.4

        for (let i = 0; i < state.constellation.points.length; i += 1) {
          for (let j = i + 1; j < state.constellation.points.length; j += 1) {
            const a = state.constellation.points[i]
            const b = state.constellation.points[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 260) {
              const opacity = (1 - distance / 260) * state.constellation.strength * pulse
              ctx.strokeStyle = `rgba(216, 180, 254, ${opacity * 0.8})`
              ctx.lineWidth = 1
              ctx.shadowColor = 'rgba(236, 73, 153, 0.8)'
              ctx.shadowBlur = 6 * state.constellation.strength
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }

        ctx.shadowBlur = 0
      }

      for (const particle of particles) {
        let glow = 0

        if (state.mouse.active && !state.magnet.active) {
          const dx = particle.x - (state.mouse.x ?? particle.x)
          const dy = particle.y - (state.mouse.y ?? particle.y)
          const distance = Math.sqrt(dx * dx + dy * dy)
          glow = Math.max(glow, 1 - Math.min(distance / 140, 1))
        }

        if (state.magnet.active) {
          const dx = particle.x - state.magnet.x
          const dy = particle.y - state.magnet.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          glow = Math.max(glow, (1 - Math.min(distance / 140, 1)) * state.magnet.strength)
        }

        if (state.constellation.active && state.constellation.points.includes(particle)) {
          glow = Math.max(glow, (0.75 + state.constellation.pulse * 0.25) * state.constellation.strength)
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.r + glow * params.particleGlow, 0, Math.PI * 2)
        if (glow > 0.02) {
          ctx.shadowColor = 'rgba(236, 73, 153, 0.9)'
          ctx.shadowBlur = 10 * glow
          ctx.fillStyle = `rgba(255, 180, 220, ${0.65 + glow * 0.35})`
        } else {
          ctx.shadowBlur = 0
          ctx.fillStyle = 'rgba(236, 73, 153, 0.65)'
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    resize()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMediaChange = () => {
      reducedMotionRef.current = reduceMotion.matches
    }
    reduceMotion.addEventListener('change', onMediaChange)

    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(document.body)

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      reduceMotion.removeEventListener('change', onMediaChange)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [variant])

  return createPortal(
    <>
      <canvas ref={canvasRef} className="network-canvas" />
      <div className="network-vignette" data-variant={variant} />
    </>,
    document.body
  )
}

export default InteractiveNetworkBackground
