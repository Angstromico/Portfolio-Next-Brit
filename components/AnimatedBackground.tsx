'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function AnimatedBackground() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.2, 0.1])

  return (
    <>
      <motion.div
        className='fixed inset-0 pointer-events-none z-0'
        style={{ opacity }}
      >
        <div className='absolute inset-0 bg-gradient-animated-1' />
        <div className='absolute inset-0 bg-gradient-animated-2' />
        <div className='absolute inset-0 bg-gradient-animated-3' />
      </motion.div>
    </>
  )
}
