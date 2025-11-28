'use client'
import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollPercentage(latest * 100)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Calculate gradient color based on scroll position
  const getGradientColor = () => {
    const hue = scrollPercentage * 1.2 // 0 to 120 (red to green)
    return `hsl(${hue}, 70%, 50%)`
  }

  return (
    <motion.div
      className='fixed top-0 left-0 right-0 h-1 z-50 origin-left'
      style={{
        scaleX,
        background: `linear-gradient(90deg, ${getGradientColor()}, ${getGradientColor()})`,
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
      }}
    />
  )
}
