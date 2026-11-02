import { PRESET_LISTS } from '../constants/presets'

export default function ChitSetup({
  chitCount,
  onCountChange,
  onGenerate,
  onLoadPreset
}) {
  return (
    <div className="py-2 animate-fade-in space-y-6">
      {/* Quick Decision Presets */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-3">
          Or Choose A Preset Matrix:
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_LISTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => onLoadPreset(preset.options)}
              className="text-xs font-mono tracking-wider px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 hover:border-indigo-400/40 text-neutral-300 hover:text-white transition-all shadow-sm active:scale-95"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Chit Count Selection */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-300">
            Number of Options
          </label>
          <span className="px-3 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl font-mono font-bold text-sm">
            {chitCount}
          </span>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="2"
            max="20"
            value={chitCount}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
          />

          <div className="flex items-center justify-between gap-2 text-xs font-mono text-neutral-400">
            <span>Quick Select:</span>
            <div className="flex gap-1.5">
              {[2, 4, 6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onCountChange(num)}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-mono ${
                    chitCount === num
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-semibold'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onGenerate}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-mono uppercase tracking-wider py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-600/25 ring-1 ring-indigo-400/30 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-[0.99] font-semibold"
        >
          <span>Generate Option Fields</span>
          <svg className="w-4 h-4 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
