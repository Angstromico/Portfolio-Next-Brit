'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className='fixed bottom-8 right-8 z-50'
        >
          <Button
            onClick={scrollToTop}
            size='icon'
            className='h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow'
            aria-label='Scroll to top'
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUp className='h-6 w-6' />
            </motion.div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
