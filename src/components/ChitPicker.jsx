import { useState, useEffect, useCallback, useRef } from 'react'
import { generateId, cryptoShuffle, getSecureRandomInt } from '../utils/random'
import { playTick, playFlip, playSuccess } from '../utils/audio'
import ChitSetup from './ChitSetup'
import ChitCard from './ChitCard'
import ActionToolbar from './ActionToolbar'
import PickResult from './PickResult'
import HistorySection from './HistorySection'
import Toast from './Toast'

export default function ChitPicker() {
  const [chitCount, setChitCount] = useState(4)
  const [chits, setChits] = useState([])
  const [shuffledChitIds, setShuffledChitIds] = useState([])
  const [pickedChitIds, setPickedChitIds] = useState([])
  const [currentPick, setCurrentPick] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showChits, setShowChits] = useState(true)
  const [toast, setToast] = useState(null)
  const [history, setHistory] = useState([])

  const animIntervalRef = useRef(null)

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type })
  }, [])

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chitPickerHistory')
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch {
      // Ignore
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chitPickerHistory', JSON.stringify(history))
    } catch {
      // Ignore
    }
  }, [history])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current)
    }
  }, [])

  const generateInputs = useCallback(() => {
    const newChits = Array.from({ length: chitCount }, () => ({
      id: generateId(),
      value: ''
    }))
    setChits(newChits)
    setShuffledChitIds([])
    setPickedChitIds([])
    setCurrentPick(null)
    setIsShuffling(false)
    setShowChits(true)
  }, [chitCount])

  const loadPreset = useCallback((options) => {
    const newChits = options.map((val) => ({
      id: generateId(),
      value: val
    }))
    setChits(newChits)
    setChitCount(newChits.length)
    setShuffledChitIds([])
    setPickedChitIds([])
    setCurrentPick(null)
    setIsShuffling(false)
    setShowChits(true)
  }, [])

  const updateChit = (id, value) => {
    setChits(prev => prev.map(chit => chit.id === id ? { ...chit, value } : chit))
  }

  const removeChit = (id) => {
    if (chits.length <= 2) {
      showToast('You must have at least 2 chits.')
      return
    }
    setChits(prev => prev.filter(c => c.id !== id))
    setShuffledChitIds(prev => prev.filter(chitId => chitId !== id))
    setPickedChitIds(prev => prev.filter(chitId => chitId !== id))
  }

  const addChit = () => {
    if (chits.length >= 20) {
      showToast('Maximum 20 chits supported.')
      return
    }
    setChits(prev => [...prev, { id: generateId(), value: '' }])
  }

  const handleShuffle = () => {
    const validChits = chits.filter(chit => chit.value.trim() !== '')
    if (validChits.length < 2) {
      showToast('Please enter at least 2 non-empty options.')
      return
    }

    playFlip()

    setIsShuffling(true)
    setShowChits(false)
    setPickedChitIds([])
    setCurrentPick(null)

    setTimeout(() => {
      const shuffledIds = cryptoShuffle(validChits.map(c => c.id))
      setShuffledChitIds(shuffledIds)

      setTimeout(() => {
        setIsShuffling(false)
      }, 500)
    }, 400)
  }

  const handlePick = useCallback(() => {
    const validChits = chits.filter(chit => chit.value.trim() !== '')
    if (validChits.length < 2) {
      showToast('Please enter at least 2 non-empty options.')
      return
    }

    // Determine unpicked candidates using unique IDs
    const unpicked = validChits.filter(chit => !pickedChitIds.includes(chit.id))
    if (unpicked.length === 0) {
      showToast('All chits have been picked! Click Reset for a new draw.', 'info')
      return
    }

    setIsAnimating(true)

    let iterations = 0
    const maxIterations = 14
    if (animIntervalRef.current) clearInterval(animIntervalRef.current)

    animIntervalRef.current = setInterval(() => {
      const tempIndex = getSecureRandomInt(unpicked.length)
      setCurrentPick(unpicked[tempIndex].value)
      playTick()
      iterations++

      if (iterations >= maxIterations) {
        clearInterval(animIntervalRef.current)

        const chosenChit = unpicked[getSecureRandomInt(unpicked.length)]
        setCurrentPick(chosenChit.value)
        setPickedChitIds(prev => [...prev, chosenChit.id])

        playSuccess()

        setHistory(prev => [
          { pick: chosenChit.value, timestamp: new Date().toISOString() },
          ...prev
        ].slice(0, 15))

        setIsAnimating(false)
      }
    }, 70)
  }, [chits, pickedChitIds, showToast])

  // Spacebar keyboard shortcut for picking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        if (!isAnimating && !isShuffling && chits.length > 0) {
          handlePick()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePick, isAnimating, isShuffling, chits.length])

  const handleBackToMenu = () => {
    setChits([])
    setShuffledChitIds([])
    setPickedChitIds([])
    setCurrentPick(null)
    setIsShuffling(false)
    setShowChits(true)
  }

  const handleReset = () => {
    setShuffledChitIds([])
    setPickedChitIds([])
    setCurrentPick(null)
    setIsShuffling(false)
    setShowChits(true)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('chitPickerHistory')
  }

  const filledChits = chits.filter(c => c.value.trim())

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-[0.35em] mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Spatial Decision Engine
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-none bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent mb-3">
          PICK IT
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base font-light max-w-md mx-auto">
          Add options, shuffle secretly into the ether, and let fate decide.
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 transition-all duration-300 ring-1 ring-white/10 shadow-2xl shadow-black/80">
        {/* Status notification */}
        {shuffledChitIds.length > 0 && !isShuffling && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2.5 text-emerald-400 text-xs font-mono uppercase tracking-wider animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Chits Shuffled &bull; Hidden in Ether</span>
          </div>
        )}

        {/* Setup Screen (Slider + Presets) */}
        {chits.length === 0 && (
          <ChitSetup
            chitCount={chitCount}
            onCountChange={setChitCount}
            onGenerate={generateInputs}
            onLoadPreset={loadPreset}
          />
        )}

        {/* Chits List */}
        {chits.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  disabled={isAnimating || isShuffling}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-white/10 hover:border-indigo-400/50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  title="Back to main menu"
                  aria-label="Back to main menu"
                >
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Menu</span>
                </button>
                <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-neutral-300">
                  {isShuffling
                    ? 'Shuffling options...'
                    : !showChits && shuffledChitIds.length > 0
                      ? 'Chits are hidden'
                      : 'Fill in your options:'}
                </h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 text-indigo-300 border border-white/10">
                {filledChits.length} / {chits.length} filled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {chits.map((chit, index) => (
                <ChitCard
                  key={chit.id}
                  chit={chit}
                  index={index}
                  isPicked={pickedChitIds.includes(chit.id) && chit.value.trim() !== ''}
                  isShuffling={isShuffling}
                  showChits={showChits}
                  onUpdate={updateChit}
                  onRemove={removeChit}
                  canRemove={chits.length > 2}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        {chits.length > 0 && (
          <ActionToolbar
            isAnimating={isAnimating}
            isShuffling={isShuffling}
            onShuffle={handleShuffle}
            onPick={handlePick}
            onReset={handleReset}
            onAddChit={addChit}
            canAddMore={chits.length < 20}
          />
        )}
      </div>

      {/* Picked Result Display */}
      <PickResult
        currentPick={currentPick}
        isAnimating={isAnimating}
        pickedCount={pickedChitIds.length}
        totalCount={filledChits.length}
      />

      {/* Pick History Section */}
      <HistorySection
        history={history}
        onClear={clearHistory}
      />

      {/* Minimal Cosmic Footer */}
      <footer className="text-center text-xs font-mono uppercase tracking-[0.25em] text-neutral-500 pt-4">
        Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 font-mono text-[10px]">Space</kbd> to pick &bull; Zero Bias
      </footer>
    </div>
  )
}
