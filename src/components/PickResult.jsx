import { useState } from 'react'

export default function PickResult({
  currentPick,
  isAnimating,
  pickedCount,
  totalCount
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
        <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 mt-4">
          {pickedCount} of {totalCount} drawn {pickedCount === totalCount ? '— all options revealed' : ''}
        </p>
      )}
    </div>
  )
}
