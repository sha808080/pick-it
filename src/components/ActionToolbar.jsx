export default function ActionToolbar({
  isAnimating,
  isShuffling,
  onShuffle,
  onPick,
  onReset,
  onAddChit,
  canAddMore
}) {
  return (
    <div className="flex flex-wrap gap-2.5 pt-3">
      {/* Add Chit Button */}
      {canAddMore && (
        <button
          type="button"
          onClick={onAddChit}
          disabled={isAnimating || isShuffling}
          className="px-4 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-indigo-400/40 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 focus:outline-none"
          title="Add another option"
        >
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </button>
      )}

      {/* Shuffle Button */}
      <button
        type="button"
        onClick={onShuffle}
        disabled={isAnimating || isShuffling}
        className={`flex-1 min-w-[120px] py-3 px-4 rounded-2xl font-mono text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-lg border active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 focus:outline-none ${
          isShuffling
            ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
            : 'bg-neutral-900 hover:bg-neutral-800 text-white border-white/15 hover:border-indigo-400/50 disabled:opacity-50'
        }`}
      >
        <svg className={`w-3.5 h-3.5 text-indigo-400 ${isShuffling ? 'animate-spin text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{isShuffling ? 'Shuffling...' : 'Shuffle'}</span>
      </button>

      {/* Pick One Button */}
      <button
        type="button"
        onClick={onPick}
        disabled={isAnimating || isShuffling}
        className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:ring-4 active:ring-indigo-500/50 text-white transition-all duration-150 shadow-xl shadow-indigo-600/30 ring-1 ring-indigo-400/40 disabled:opacity-50 flex items-center justify-center gap-2 group font-semibold focus:outline-none"
      >
        <svg className="w-4 h-4 transition-transform group-hover:rotate-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Pick One</span>
      </button>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        disabled={isAnimating || isShuffling}
        className="px-4 py-3 rounded-2xl font-mono text-xs uppercase tracking-wider bg-white/5 hover:bg-rose-950/40 hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 border border-white/10 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-1.5 active:bg-rose-950/50 active:border-rose-400 active:ring-2 active:ring-rose-500/30 focus:outline-none"
        title="Reset picked status for a new round"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Reset</span>
      </button>
    </div>
  )
}
