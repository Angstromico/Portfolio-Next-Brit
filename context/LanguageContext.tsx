'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type Language = 'en' | 'es'

interface LanguageContextProps {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const browserLang = navigator.language
    if (browserLang.startsWith('es')) {
      setLanguage('es')
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
