import { useState } from 'react'

export default function PickResult({
  currentPick,
  isAnimating,
  pickedCount,
  totalCount,
  showChits,
  onToggleReveal
}) {
  const [copied, setCopied] = useState(false)

  if (!currentPick) return null

  const handleCopy = () => {
    if (!currentPick || isAnimating) return
    navigator.clipboard.writeText(currentPick).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div
      role="region"
      aria-live="polite"
      className="glass-card rounded-3xl p-6 md:p-8 mb-8 text-center animate-fade-in border border-indigo-500/30 ring-1 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10 relative overflow-hidden"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-mono uppercase tracking-[0.3em] mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
        <span>{isAnimating ? 'Decrypting Option...' : 'Selected Decision'}</span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <h2
          className={`text-4xl md:text-6xl font-bold tracking-tight leading-tight transition-all duration-150 break-words max-w-xl ${
            isAnimating
              ? 'text-indigo-400 scale-95 opacity-80'
              : 'bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent scale-100'
          }`}
        >
          {currentPick}
        </h2>

        {!isAnimating && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 focus:outline-none"
            title="Copy choice"
            aria-label="Copy chosen option"
          >
            {copied ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {!isAnimating && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            {pickedCount} of {totalCount} drawn {pickedCount === totalCount ? '— all options drawn' : ''}
          </p>

          {onToggleReveal && (
            <button
              type="button"
              onClick={onToggleReveal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/15 hover:border-indigo-400/50 transition-all duration-150 active:bg-indigo-600/30 active:border-indigo-400 active:ring-2 active:ring-indigo-500/40 focus:outline-none shadow-sm"
              title={showChits ? 'Hide the options above' : 'Reveal the options above'}
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {showChits ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                )}
              </svg>
              <span>{showChits ? 'Hide Above Options' : 'Reveal Above Options'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
