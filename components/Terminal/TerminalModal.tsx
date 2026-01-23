'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGamer } from '@/context/GamerContext'
import Terminal from './Terminal'

export const TerminalModal = () => {
  const {
    isTerminalOpen,
    toggleTerminal,
    isTerminalMaximized,
    isTerminalMinimized,
  } = useGamer()

  return (
    <AnimatePresence>
      {isTerminalOpen && (
        <React.Fragment>
          {/* Backdrop */}
          {!isTerminalMinimized && !isTerminalMaximized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleTerminal}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[50]'
            />
          )}

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: isTerminalMinimized ? 'calc(100vh - 40px)' : 0,
              x: isTerminalMinimized ? 'calc(50vw - 150px)' : 0,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`fixed z-[60] flex items-center justify-center pointer-events-none ${
              isTerminalMaximized
                ? 'inset-0'
                : isTerminalMinimized
                  ? 'bottom-0 left-0 right-0 h-0 items-end'
                  : 'inset-0'
            }`}
          >
            <div
              className={`pointer-events-auto transition-all duration-300 ${
                isTerminalMaximized
                  ? 'w-full h-full'
                  : isTerminalMinimized
                    ? 'w-[300px] h-[40px] overflow-hidden'
                    : 'w-full max-w-3xl h-[400px] md:h-[600px] p-4 md:p-0'
              }`}
            >
              <Terminal />
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  )
}

export default TerminalModal
