import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const IMAGES = [
  { src: "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg", title: "Chroma I" },
  { src: "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg", title: "Prism III" },
  { src: "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg", title: "Cosmos IV" },
  { src: "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c440db3f71d4e8c03262a3287577.jpg", title: "Quantum V" },
  { src: "https://cdn.21st.dev/assets/mirror/ef/ef25eff6ce655fba459b3b7e7711524dc92499aa18f6c7dbea9a0fcc56a8f908.jpg", title: "Nebula VI" },
  { src: "https://cdn.21st.dev/assets/mirror/f2/f28b370a5dcbf76240f1504579c4b05fc0ff0bb990a42aff8dc2f73a5dc46072.jpg", title: "Cyber VII" },
  { src: "https://cdn.21st.dev/assets/mirror/f2/f26a1eac85704dda924820392dedfb72d51d8261d35354f83b35d683617295f3.jpg", title: "Flux VIII" },
  { src: "https://cdn.21st.dev/assets/mirror/77/7755d23eaaa0aa5b403343f44afa7a29b2d06d3065fe54c602b14ba01d00f2aa.jpg", title: "Vortex IX" },
  { src: "https://cdn.21st.dev/assets/mirror/65/657317761fe9058a1d43711b13c543a71eb5199b7a5d9abf4c28479674e39cf7.jpg", title: "Chroma X" },
]

const TUNNEL_CARDS = IMAGES.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180)
  const radiusFactorX = 0.28 + (i % 3) * 0.08
  const radiusFactorY = 0.26 + (i % 2) * 0.09

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  }
})

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 }

function useCameraParallax(enabled) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, rawX, rawY])

  return { x, y }
}

function TunnelCard({ card, progress, pointer, total, stage }) {
  const staggerSpan = 0.55
  const start = (card.index / total) * (1 - staggerSpan)
  const end = start + staggerSpan

  const localProgress = useTransform(progress, [start, end], [0, 1])

  const farZ = stage.isMobile ? -1200 : -1700
  const nearZ = stage.isMobile ? 350 : 500
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ])

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0])

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18))

  const baseX = card.angleCos * (stage.width * card.radiusFactorX)
  const baseY = card.angleSin * (stage.height * card.radiusFactorY)
  const panStrength = stage.isMobile ? 20 : 45

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currZ, px, py]) => {
      const offsetX = baseX - px * panStrength
      const offsetY = baseY - py * panStrength
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`
    }
  )

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-2xl shadow-neutral-950/20 dark:shadow-black/90 ring-1 ring-black/10 dark:ring-white/15 transition-all duration-500 hover:ring-indigo-500/70 dark:hover:ring-indigo-400/70 hover:shadow-indigo-500/25">
        <img
          src={card.item.src}
          alt={card.item.title || "Card"}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>
    </motion.div>
  )
}

export default function PerspectiveTunnelHero({ onEnterApp }) {
  const containerRef = useRef(null)
  const reduce = useReducedMotion()

  const [stage, setStage] = useState({
    width: 1440,
    height: 900,
    isMobile: false,
  })

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Raw motion value controlled directly by mouse wheel / touch
  const rawProgress = useMotionValue(0)
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  })

  // Wheel listener
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e) => {
      e.preventDefault()
      const current = rawProgress.get()
      const delta = e.deltaY * 0.0008
      const next = Math.min(1, Math.max(0, current + delta))
      rawProgress.set(next)
    }

    // Touch support for mobile devices
    let touchStartY = 0
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const delta = (touchStartY - e.touches[0].clientY) * 0.002
        touchStartY = e.touches[0].clientY
        const current = rawProgress.get()
        const next = Math.min(1, Math.max(0, current + delta))
        rawProgress.set(next)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
    }
  }, [rawProgress])

  // Automatically transition when scrolling completes near the end
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (val) => {
      if (val >= 0.96) {
        onEnterApp?.()
      }
    })
    return () => unsubscribe()
  }, [smoothProgress, onEnterApp])

  const pointer = useCameraParallax(!reduce)

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35])
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0])
  const promptOpacity = useTransform(smoothProgress, [0, 0.15, 0.75, 1], [1, 1, 0.2, 0])
  const enterButtonOpacity = useTransform(smoothProgress, [0, 0.25, 0.8], [0.35, 0.8, 1])

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-screen overflow-hidden bg-neutral-950 text-white select-none flex items-center justify-center"
      style={{
        perspective: stage.isMobile ? '900px' : '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top Bar Quick Skip / Launch Button */}
      <motion.div
        style={{ opacity: enterButtonOpacity }}
        className="fixed top-6 right-6 z-50 pointer-events-auto"
      >
        <button
          onClick={onEnterApp}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase tracking-wider transition-all duration-150 shadow-lg hover:shadow-indigo-500/20 focus:outline-none"
        >
          <span>Enter Pick It</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </motion.div>

      {/* Immersive Background Grid & Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_75%)]" />

      {/* Depth Ring Guides */}
      <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-indigo-400/10" />
      <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

      {/* Central Anchor Typography */}
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="pointer-events-none z-0 flex flex-col items-center text-center px-6 max-w-xl"
      >
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-indigo-400 mb-4">
          Instant Decision Engine
        </p>
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
          PICK IT.
        </h1>
        <p className="mt-4 max-w-[42ch] text-sm sm:text-base font-light text-neutral-300 leading-relaxed">
          Can't decide? Add your choices, shuffle them into hidden chits, and let chance make a fair, unbiased pick for you.
        </p>
      </motion.div>

      {/* Scroll Prompt & Tap to Enter */}
      <motion.div
        style={{ opacity: promptOpacity }}
        className="pointer-events-auto absolute bottom-8 z-20 flex flex-col items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 cursor-pointer"
        onClick={onEnterApp}
      >
        <span className="hover:text-white transition-colors">Scroll to Explore &bull; Or Tap to Start</span>
        <div className="h-6 w-px bg-gradient-to-b from-indigo-500 to-transparent animate-pulse" />
      </motion.div>

      {/* 3D Z-Space Plane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {TUNNEL_CARDS.map((card, i) => (
          <TunnelCard
            key={i}
            card={card}
            progress={smoothProgress}
            pointer={pointer}
            total={TUNNEL_CARDS.length}
            stage={stage}
          />
        ))}
      </div>
    </div>
  )
}

