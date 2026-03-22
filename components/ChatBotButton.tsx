'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, BotMessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { chatBotTranslations } from '@/translations/modeToggle'

export default function ChatBotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([])
  const [input, setInput] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isApiAvailable, setIsApiAvailable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguage()
  const t = chatBotTranslations[language]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    fetch('/api/chat/check')
      .then(res => res.json())
      .then(data => {
        if (data.ok) setIsApiAvailable(true)
      })
      .catch((e) => {
        console.error('Chat API not available:', e)
        setIsApiAvailable(false)
      })
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMessage = { role: 'user', content: input } as const
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })
      if (!response.ok) throw new Error('Network response was not ok')
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the server.' }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted || !isApiAvailable) return null

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='fixed bottom-28 left-8 z-50 group'
          >
            {/* Tooltip */}
            <div className='absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl z-50'>
              {t.tooltip}
              <div className='absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-foreground rotate-45 transform'></div>
            </div>

            <Button
              onClick={() => setIsOpen(true)}
              className='h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 p-0 flex items-center justify-center'
              aria-label={t.tooltip}
            >
              <BotMessageSquare className='w-7 h-7' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed bottom-24 left-8 z-50 w-[90vw] max-w-sm bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh]'
            >
              <div className='bg-primary p-4 flex items-center justify-between shrink-0'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center'>
                    <BotMessageSquare className='w-6 h-6 text-primary-foreground' />
                  </div>
                  <div>
                    <h3 className='text-primary-foreground font-bold text-sm'>{t.name}</h3>
                    <p className='text-primary-foreground/80 text-xs'>{t.status}</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen(false)}
                  className='text-primary-foreground hover:bg-primary-foreground/20 rounded-full h-8 w-8'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>

              <div className='flex-1 p-4 overflow-y-auto bg-muted/30 flex flex-col gap-3'>
                <div className='flex gap-2 w-full'>
                    <div className='bg-muted border border-border text-foreground rounded-r-2xl rounded-tl-2xl p-3 text-sm max-w-[85%] shadow-sm'>
                      <p>{t.greeting}</p>
                    </div>
                </div>

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 text-sm max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl' : 'bg-muted border border-border text-foreground rounded-r-2xl rounded-tl-2xl'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className='flex justify-start w-full'>
                    <div className='bg-muted border border-border text-foreground rounded-r-2xl rounded-tl-2xl p-3 text-sm shadow-sm flex gap-1 items-center'>
                      <div className='w-2 h-2 rounded-full bg-foreground/40 animate-bounce' />
                      <div className='w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-.3s]' />
                      <div className='w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-.5s]' />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className='p-3 bg-background border-t shrink-0 flex gap-2 w-full items-end'>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={t.placeholder}
                    className='flex-1 max-h-32 min-h-[44px] h-[44px] p-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                    autoFocus
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className='h-[44px] w-[44px] rounded-xl shrink-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
                  >
                    <Send className='h-4 w-4' />
                  </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
