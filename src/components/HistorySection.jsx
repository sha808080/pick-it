export default function HistorySection({ history, onClear }) {
  if (history.length === 0) return null

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 animate-fade-in ring-1 ring-white/10">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Chronicle / Recent Draws</span>
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-rose-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span className="font-medium text-neutral-200">
                {item.pick}
              </span>
            </div>
            <span className="text-neutral-500">
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
