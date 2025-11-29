'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { whatsAppTranslations } from '@/translations/modeToggle'

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { language } = useLanguage()
  const t = whatsAppTranslations[language]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const phoneNumber = '584144021058'

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(url, '_blank')
    setIsOpen(false)
    setMessage('')
  }

  if (!isMounted) return null

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='fixed bottom-8 left-8 z-50'
          >
            <Button
              onClick={() => setIsOpen(true)}
              className='h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all duration-300 p-0 flex items-center justify-center'
              aria-label={t.chatOnWhatsApp}
            >
              <svg
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-8 h-8 text-white'
              >
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
              </svg>
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
              className='fixed bottom-24 left-8 z-50 w-[90vw] max-w-sm bg-background border border-border rounded-2xl shadow-2xl overflow-hidden'
            >
              <div className='bg-[#075E54] p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                    <svg
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='w-6 h-6 text-white'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-white font-bold text-sm'>{t.name}</h3>
                    <p className='text-white/80 text-xs'>{t.status}</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen(false)}
                  className='text-white hover:bg-white/20 rounded-full h-8 w-8'
                >
                  <X className='h-5 w-5' />
                </Button>
              </div>

              <div className="p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10">
                <div className='bg-background rounded-lg p-2 shadow-sm mb-4 max-w-[85%]'>
                  <p className='text-sm'>{t.greeting}</p>
                  <span className='text-[10px] text-muted-foreground block text-right mt-1'>
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.placeholder}
                  className='w-full min-h-[100px] p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none'
                  autoFocus
                />

                <Button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className='w-full mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2'
                >
                  <Send className='h-4 w-4' />
                  {t.send}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
