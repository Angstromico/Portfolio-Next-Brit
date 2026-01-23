'use client'

import React from 'react'
import { useGamer } from '@/context/GamerContext'

export const Scanlines = () => {
  const { isGamerMode } = useGamer()

  if (!isGamerMode) return null

  return (
    <div className='pointer-events-none fixed inset-0 z-[99999] overflow-hidden'>
      <div className='absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] bg-center' />
      <div className='animate-scanline absolute inset-0 bg-white/5 opacity-10' />
    </div>
  )
}

export default Scanlines
