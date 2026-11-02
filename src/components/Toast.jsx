import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose()
    }, 3500)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const isError = type === 'error'

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in max-w-md w-[90%] sm:w-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-mono uppercase tracking-wider ${
        isError
          ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/40'
          : 'bg-neutral-900/90 text-neutral-200 border-white/15 shadow-black/80'
      }`}>
        {isError ? (
          <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
          aria-label="Dismiss message"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
