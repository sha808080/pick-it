import { motion } from 'framer-motion'

export default function ChitCard({
  chit,
  index,
  isPicked,
  isShuffling,
  showChits,
  onUpdate,
  onRemove,
  canRemove
}) {
  return (
    <motion.div
      layout
      animate={{
        scale: isShuffling ? 1.02 : 1,
        y: isShuffling ? -3 : 0,
        zIndex: isShuffling ? 20 : 1
      }}
      transition={{
        layout: {
          duration: 0.55,
          ease: [0.25, 1, 0.5, 1] // silky smooth glide with zero shaking
        },
        scale: { duration: 0.18 },
        y: { duration: 0.18 }
      }}
      className={`relative ${isPicked ? 'opacity-35 grayscale-[50%]' : ''}`}
    >
      <div className={`flip-card ${!showChits ? 'flipped' : ''}`}>
        <div className="flip-card-inner">
          {/* Front Side: Input Card */}
          <div className="flip-card-front">
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-xs font-mono font-bold text-neutral-500 select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={chit.value}
                onChange={(e) => onUpdate(chit.id, e.target.value)}
                placeholder={`Option ${index + 1}`}
                disabled={isPicked || isShuffling}
                className={`w-full pl-11 ${canRemove ? 'pr-16' : 'pr-10'} py-3.5 rounded-2xl border text-sm font-medium ${
                  isPicked
                    ? 'border-white/5 bg-neutral-950/80 text-neutral-500 line-through'
                    : 'border-white/10 bg-neutral-900/90 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 shadow-inner'
                }`}
              />
              <div className="absolute right-2.5 flex items-center gap-1">
                {isPicked ? (
                  <div className="text-emerald-400 flex items-center pr-1.5" title="Picked">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : canRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(chit.id)}
                    disabled={isShuffling}
                    className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0 focus:outline-none"
                    title="Remove this option"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Back Side: Only Centered Lock Icon */}
          <div className="flip-card-back">
            <div className={`w-full h-full min-h-[52px] flex items-center justify-center rounded-2xl bg-neutral-900 border transition-all duration-200 ring-1 shadow-2xl px-4 ${
              isShuffling
                ? 'border-indigo-400/70 ring-indigo-500/40 shadow-indigo-500/20'
                : 'border-white/15 ring-white/5'
            }`}>
              <svg
                className={`w-5 h-5 text-indigo-400 transition-transform duration-200 ${
                  isShuffling ? 'scale-110 text-indigo-300' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
