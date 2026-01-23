'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamer } from '@/context/GamerContext'
import Terminal from './Terminal'

export const TerminalModal = () => {
  const { isTerminalOpen, toggleTerminal } = useGamer()

  return (
    <AnimatePresence>
      {isTerminalOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleTerminal}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className='fixed inset-0 z-[60] flex items-center justify-center pointer-events-none'
          >
            <div className='w-full max-w-3xl h-[400px] md:h-[600px] pointer-events-auto p-4 md:p-0'>
              <Terminal />
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
}

export default TerminalModal
