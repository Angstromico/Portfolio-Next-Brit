'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

type GamerContextType = {
  isGamerMode: boolean
  toggleGamerMode: () => void
  isTerminalOpen: boolean
  toggleTerminal: () => void
  playHoverSound: () => void
  playClickSound: () => void
  playSuccessSound: () => void
}

const GamerContext = createContext<GamerContextType | undefined>(undefined)

export const GamerProvider = ({ children }: { children: ReactNode }) => {
  const [isGamerMode, setIsGamerMode] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false) // Start closed
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)

  useEffect(() => {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )()
    setAudioCtx(ctx)
    return () => {
      ctx.close()
    }
  }, [])

  const toggleGamerMode = () => {
    setIsGamerMode((prev) => !prev)
    if (!isGamerMode) {
      playSuccessSound()
    } else {
      setIsTerminalOpen(false) // Close terminal if gamer mode is disabled
    }
  }

  const toggleTerminal = () => {
    if (isGamerMode) {
      setIsTerminalOpen((prev) => !prev)
      playClickSound()
    }
  }

  const playOscillator = (
    freq: number,
    type: OscillatorType,
    duration: number,
    delay = 0,
  ) => {
    if (!audioCtx) return

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay)

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + delay + duration,
    )

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    osc.start(audioCtx.currentTime + delay)
    osc.stop(audioCtx.currentTime + delay + duration)
  }

  const playHoverSound = () => {
    if (!isGamerMode) return
    playOscillator(440, 'square', 0.1)
  }

  const playClickSound = () => {
    if (!isGamerMode) return
    playOscillator(880, 'square', 0.1)
  }

  const playSuccessSound = () => {
    if (!audioCtx) return
    // Simple "power up" arpeggio
    playOscillator(440, 'square', 0.1, 0)
    playOscillator(554, 'square', 0.1, 0.1)
    playOscillator(659, 'square', 0.1, 0.2)
    playOscillator(880, 'square', 0.4, 0.3)
  }

  return (
    <GamerContext.Provider
      value={{
        isGamerMode,
        toggleGamerMode,
        isTerminalOpen,
        toggleTerminal,
        playHoverSound,
        playClickSound,
        playSuccessSound,
      }}
    >
      {children}
    </GamerContext.Provider>
  )
}

export const useGamer = () => {
  const context = useContext(GamerContext)
  if (context === undefined) {
    throw new Error('useGamer must be used within a GamerProvider')
  }
  return context
}
