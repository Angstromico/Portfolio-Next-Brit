'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

interface ParticleBadgeProps {
  children: React.ReactNode
  particleCount?: number
}

export default function ParticleBadge({
  children,
  particleCount = 6,
}: ParticleBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (360 / particleCount) * i,
  }))

  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge className='relative z-10 transition-transform hover:scale-110'>
        {children}
      </Badge>
      <AnimatePresence>
        {isHovered &&
          particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 0.3,
              }}
              animate={{
                opacity: 0,
                x: Math.cos((particle.angle * Math.PI) / 180) * 40,
                y: Math.sin((particle.angle * Math.PI) / 180) * 40,
                scale: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
              className='absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none'
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}
