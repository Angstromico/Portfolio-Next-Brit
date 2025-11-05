'use client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Linkedin } from 'lucide-react'
import { ModeToggle } from './ui/toggle-mode'
import LanguageDropdown from './ui/toggle-lang'
import useActiveSection from '@/hooks/useActiveSection'
import { useLanguage } from '@/context/LanguageContext'
import { navTranslations } from '@/translations/modeToggle'

type NavItem = {
  name: string
  href: string
}

export default function Nav() {
  const { language } = useLanguage()
  const t = navTranslations[language]

  const activeSection = useActiveSection([
    'about',
    'experience',
    'projects',
    'contact',
  ])

  const navItems: NavItem[] = [
    { name: t.about, href: '#about' },
    { name: t.experience, href: '#experience' },
    { name: t.projects, href: '#projects' },
    { name: t.contact, href: '#contact' },
  ]

  const getNavItemClasses = (href: string) => {
    const isActive = activeSection === href.substring(1)
    return {
      linkClass: isActive ? 'active' : '',
      indicatorClass: `nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all ${
        isActive
          ? 'active w-16 bg-foreground h-2'
          : 'group-hover:w-16 group-hover:bg-foreground group-hover:h-px'
      }`,
      textClass: `nav-text text-xs font-bold uppercase tracking-widest ${
        isActive
          ? 'text-foreground'
          : 'text-slate-500 group-hover:text-foreground'
      }`,
    }
  }

  return (
    <header className='lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 flex flex-col lg:gap-4'>
      <div className='flex flex-col gap-4 lg:pr-24 mt-6 lg:mt-0'>
        <div className='w-full flex lg:items-center lg:justify-start'>
          <Avatar className='w-24 lg:w-36 h-auto border-2 border-primary bg-secondary'>
            <AvatarImage
              src='./avatar.png'
              secondarySrc='./alter-avatar.png'
              alt='Avatar'
            />
            <AvatarFallback className='w-24 h-24 lg:w-36 lg:h-36 rounded-full border-1 border-primary'>
              AM
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className='text-[42px] font-bold lg:text-start'>
          {t.hi}, {t.name}
        </h1>
        <h2 className='text-xl lg:text-start'>{t.title}</h2>
        <p className='text-lg lg:text-start text-muted-foreground'>
          {t.description}
        </p>
      </div>
      <nav className='lg:flex hidden'>
        <ul className='flex flex-col w-max text-start gap-6 uppercase text-xs font-medium'>
          {navItems.map((item: NavItem) => {
            const { linkClass, indicatorClass, textClass } = getNavItemClasses(
              item.href
            )
            return (
              <li key={item.name} className='group'>
                <a href={item.href} className={`py-3 ${linkClass}`}>
                  <span className={indicatorClass}></span>
                  <span className={textClass}>{item.name}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <ul className='flex flex-row gap-6 mt-6 lg:mt-0'>
        <Button variant='outline' size='icon'>
          <a
            href='https://github.com/Angstromico'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Github className='h-[1.2rem] w-[1.2rem]' />
          </a>
        </Button>
        <Button variant='outline' size='icon'>
          <a
            href='https://www.linkedin.com/in/manuel-esteban-morales-zuarez-68573b189/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Linkedin className='h-[1.2rem] w-[1.2rem]' />
          </a>
        </Button>
        <ModeToggle />
        <LanguageDropdown />
      </ul>
    </header>
  )
}
