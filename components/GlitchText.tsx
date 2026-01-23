'use client'

import { useGamer } from '@/context/GamerContext'
import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export const GlitchText = ({
  children,
  as: Component = 'span',
  className = '',
}: GlitchTextProps) => {
  const { isGamerMode } = useGamer()

  if (!isGamerMode) {
    return <Component className={className}>{children}</Component>
  }

  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className='relative z-10'>{children}</span>
      <motion.span
        className='absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 group-hover:translate-x-[2px] group-hover:translate-y-[2px]'
        aria-hidden='true'
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [-2, 2, -1, 1, 0],
          y: [1, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.5,
          repeatType: 'mirror',
          repeatDelay: 2,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className='absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-70 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]'
        aria-hidden='true'
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [2, -2, 1, -1, 0],
          y: [-1, 1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.4,
          repeatType: 'mirror',
          repeatDelay: 3,
        }}
      >
        {children}
      </motion.span>
    </Component>
  )
}

export default GlitchText
