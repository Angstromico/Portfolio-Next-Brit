'use client'

import React from 'react'
import { useGamer } from '@/context/GamerContext'
import { Gamepad2, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useKonamiCode } from '@/hooks/useKonamiCode'

export const GamerModeToggle = () => {
  const { isGamerMode, toggleGamerMode } = useGamer()

  useKonamiCode(() => {
    toggleGamerMode()
  })

  return (
    <Button
      variant={isGamerMode ? 'destructive' : 'outline'}
      size='icon'
      onClick={toggleGamerMode}
      className={`relative overflow-hidden transition-all duration-300 ${isGamerMode ? 'animate-pulse ring-2 ring-green-400 border-green-500' : ''}`}
      title={isGamerMode ? 'Disable Gamer Mode' : 'Enable Gamer Mode'}
    >
      <motion.div
        animate={{ rotate: isGamerMode ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isGamerMode ? (
          <Ghost className='h-[1.2rem] w-[1.2rem]' />
        ) : (
          <Gamepad2 className='h-[1.2rem] w-[1.2rem]' />
        )}
      </motion.div>
    </Button>
  )
}

export default GamerModeToggle
