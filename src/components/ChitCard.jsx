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
    <div className={`relative transition-all duration-300 ${isPicked ? 'opacity-35 grayscale-[50%]' : ''}`}>
      <div className={`flip-card ${!showChits ? 'flipped' : ''}`}>
        <div className="flip-card-inner">
          {/* Front Side: Input Card */}
          <div className="flip-card-front">
            <div className="relative flex items-center group">
              <span className="absolute left-3.5 text-xs font-mono font-bold text-neutral-500 select-none">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={chit.value}
                onChange={(e) => onUpdate(chit.id, e.target.value)}
                placeholder={`Option ${index + 1}`}
                disabled={isPicked || isShuffling}
                className={`w-full pl-11 ${canRemove ? 'pr-16' : 'pr-10'} py-3.5 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                  isPicked
                    ? 'border-white/5 bg-neutral-950/80 text-neutral-500 line-through'
                    : 'border-white/10 bg-neutral-900/90 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 shadow-inner'
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
                    className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
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

          {/* Back Side: Hidden Ether Card (matching PerspectiveTunnelHero card aesthetic) */}
          <div className="flip-card-back">
            <div className="w-full h-full min-h-[52px] flex items-center justify-between rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/40 border border-white/15 ring-1 ring-white/5 shadow-2xl px-4 text-neutral-300">
              <div className="flex items-center gap-2.5 text-xs font-mono tracking-wider uppercase text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Chit #{String(index + 1).padStart(2, '0')} Hidden</span>
              </div>
              <svg className="w-4 h-4 text-indigo-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
