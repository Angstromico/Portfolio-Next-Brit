'use client'

import { useEffect, useState } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export const useKonamiCode = (action: () => void) => {
  const [inputIndex, setInputIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentKey = e.key
      // Check if the key matches the current expected key in the sequence
      if (currentKey === KONAMI_CODE[inputIndex]) {
        const nextIndex = inputIndex + 1
        if (nextIndex === KONAMI_CODE.length) {
          // Full code entered
          action()
          setInputIndex(0) // Reset
        } else {
          setInputIndex(nextIndex)
        }
      } else {
        // Mistake made, buffer reset
        // However, we should be careful. If they type 'ArrowUp', 'ArrowUp', 'b', it resets.
        // But if they type 'ArrowUp', 'ArrowUp', 'ArrowUp', the third one is actually the start of a new potential sequence or just a mistake?
        // Simple implementation: reset on mismatch.
        // Better implementation: Check if the key matches the START of the sequence to allow restarts?
        // For simple Konami, exact match or reset is standard.
        // But we must handle the case where the user types "Up (0), Up (1), Up (mistake)".
        // If we reset to 0, they have to start over.
        // Actually, if they type the correct key, we advance. If incorrect, we verify if it matches index 0.

        if (currentKey === KONAMI_CODE[0]) {
          setInputIndex(1)
        } else {
          setInputIndex(0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inputIndex, action])
}
