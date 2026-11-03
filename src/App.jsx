import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChitPicker from './components/ChitPicker'
import PerspectiveTunnelHero from './components/PerspectiveTunnelHero'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white selection:bg-indigo-500 selection:text-white relative overflow-x-hidden font-sans">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="tunnel-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <PerspectiveTunnelHero onEnterApp={() => setShowIntro(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="chit-picker-app"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="min-h-screen relative"
          >
            {/* Immersive Cosmic Background matching PerspectiveTunnelHero */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-65" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_75%)]" />

            {/* Depth Ring Guides */}
            <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[52vmin] w-[52vmin] rounded-full border border-indigo-400/10" />
            <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[82vmin] w-[82vmin] rounded-full border border-dashed border-white/10" />

            {/* Top Bar Actions */}
            <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5">
              <button
                onClick={() => setShowIntro(true)}
                className="group flex items-center gap-2 px-4 h-10 rounded-full bg-white/5 hover:bg-white/15 active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 backdrop-blur-md border border-white/15 shadow-xl text-neutral-300 hover:text-white transition-all duration-150 text-xs font-mono uppercase tracking-wider focus:outline-none"
                title="Return to 3D Tunnel Sequence"
                aria-label="Return to 3D Tunnel Sequence"
              >
                <svg className="w-3.5 h-3.5 text-indigo-400 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <span>3D Tunnel</span>
              </button>
            </div>

            {/* App Body */}
            <div className="relative z-10">
              <ChitPicker />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
