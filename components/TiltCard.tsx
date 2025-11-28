'use client'
import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export default function TiltCard({
  children,
  className = '',
  intensity = 10,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateX = ((e.clientY - centerY) / rect.height) * -intensity
    const rotateY = ((e.clientX - centerX) / rect.width) * intensity

    setRotation({ x: rotateX, y: rotateY })

    // Calculate glow position as percentage
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`relative ${className}`}
    >
      <div
        className='absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-lg'
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(59, 130, 246, 0.8) 0%, transparent 50%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
