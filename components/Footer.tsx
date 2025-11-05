'use client'
import { useLanguage } from '@/context/LanguageContext'
import { footerTranslations } from '@/translations/modeToggle'

export default function Footer() {
  const { language } = useLanguage()
  const t = footerTranslations[language]

  return (
    <section>
      <div className='flex flex-col gap-4 lg:px-6 mt-16'>
        <p className='text-sm text-start text-muted-foreground'>
          {t.base_text_1}{' '}
          <a className='text-foreground' href='https://brittanychiang.com'>
            {t.link_site}
          </a>{' '}
          {t.base_text_2}{' '}
          <a className='text-foreground' href='https://code.visualstudio.com/'>
            {t.link_code}
          </a>{' '}
          {t.base_text_3}{' '}
          <a className='text-foreground' href='https://nextjs.org/'>
            {t.link_framework}
          </a>
          ,{' '}
          <a className='text-foreground' href='https://tailwindcss.com/'>
            {t.link_css}
          </a>{' '}
          {t.and}{' '}
          <a className='text-foreground' href='https://ui.shadcn.com/'>
            {t.link_ui}
          </a>
          {t.deployed_with}{' '}
          <a className='text-foreground' href='https://vercel.com/'>
            {t.link_deploy}
          </a>
          .
        </p>
      </div>
    </section>
  )
}
