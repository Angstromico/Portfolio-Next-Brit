'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoveRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { expCardsTranslations } from '@/translations/modeToggle'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import ParticleBadge from './ParticleBadge'

export default function ExpCard() {
  const { language } = useLanguage()
  const jobPositions = expCardsTranslations[language]

  const CV_PATH =
    language === 'en'
      ? '/manuel-morales-harvard.pdf'
      : '/manuel-morales-harvard-es.pdf'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <section id='experience' className='scroll-mt-16 lg:mt-16'>
      <div className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest lg:sr-only'>
          Experience
        </h2>
      </div>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-50px' }}
      >
        {jobPositions.map((job, index) => (
          <motion.div key={index} variants={itemVariants}>
            <TiltCard intensity={8}>
              <Card className='lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200 transition-all duration-300 hover:scale-[1.02]'>
                <CardHeader className='h-full w-full p-0'>
                  <CardTitle className='text-base text-slate-400 whitespace-nowrap pulse-glow'>
                    {job.timeline}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col p-0'>
                  <p className='text-foreground font-bold'>
                    {job.currentPosition} • {job.place}
                  </p>
                  {job.previousPositions.map((position, index) => (
                    <p key={index} className='text-slate-400 text-sm font-bold'>
                      {position}
                    </p>
                  ))}
                  <CardDescription className='py-3 text-muted-foreground'>
                    {job.description}
                  </CardDescription>
                  <CardFooter className='p-0 flex flex-wrap gap-2'>
                    {job.skills.map((skill, index) => (
                      <ParticleBadge key={index}>{skill}</ParticleBadge>
                    ))}
                  </CardFooter>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
      <div className='lg:px-12 mt-12'>
        <a
          href={CV_PATH}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center font-medium leading-tight text-foreground group'
        >
          <span className='border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none'>
            {language === 'en'
              ? 'Reach out for Full Resume'
              : 'Solicitar currículum completo'}
          </span>
          <MoveRight className='ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none' />
        </a>
      </div>
    </section>
  )
}
