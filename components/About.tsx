'use client'
/* eslint-disable */
import { useLanguage } from '@/context/LanguageContext'
import { aboutTranslations } from '@/translations/modeToggle'

export default function About() {
  const { language } = useLanguage()
  const t = aboutTranslations[language]

  return (
    <section id='about' className='scroll-mt-16'>
      <div className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest lg:sr-only'>
          About
        </h2>
      </div>

      <div className='flex flex-col gap-4'>
        <p className='text-start text-muted-foreground lg:px-6'>
          {t.first} <span className='text-white'>{t.second}</span> {t.third}
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          {t.fourth}{' '}
          <a
            className='no-wrap text-primary dark:text-white'
            href='https://miafemtech.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Mia Femtech.
          </a>
          {t.fifth} <span className='text-white'>{t.sixth}</span>
          {t.seventh}
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          {t.eighth} <span className='text-white'>{t.ninth}</span>, {t.tenth}
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          {t.eleventh} <span className='text-white'>{t.twelfth}</span>{' '}
          {t.thirteenth}
        </p>
      </div>
    </section>
  )
}
