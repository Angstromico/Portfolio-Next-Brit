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

const jobPositions = [
  {
    timeline: 'Sep 2024 — Present',
    currentPosition: 'MERM Developer',
    place: 'DevNavigate',
    previousPositions: [''],
    description:
      'At DevNavigate, I contributed to full-stack development initiatives for Velzia Group, building and optimizing core business systems. I developed a supplier order generation system for both foreign and domestic vendors, strengthened website security by implementing multi-factor authentication (MFA), and worked extensively on the product receiving logistics module to streamline operational workflows. Additionally, I enhanced overall website performance and responsiveness by optimizing controller logic, refining API calls, and improving front-end code efficiency.',
    skills: [
      'MERM Stack',
      'Product Design',
      'Redux',
      'Design Systems',
      'Design Strategy',
    ],
  },
  {
    timeline: 'Jun 2022 — Sep 2024',
    currentPosition: 'Web Developer',
    place: 'Establishment Labs',
    previousPositions: [''],
    description: `At Establishment Labs, I worked across two major projects: Mia Femtech and Motiva Image, both focused on healthcare innovation and patient experience.

For Mia Femtech, built with Nuxt, Drupal, and AWS, I helped design and implement a multilingual platform centered on minimally invasive breast harmonization — preserving natural tissue, sensitivity, and aesthetics while reducing the need for general anesthesia.

For Motiva Image, developed using React, Laravel, and SQL, I contributed to building a system that allows patients and surgeons to register and manage implant information with long-term reliability and peace of mind. Both projects combined secure architecture, refined UI/UX, and scalable integrations to support a global audience in the medical technology space.`,
    skills: ['Vue', 'AWS', 'Full Stack Development', 'Design Strategy'],
  },
  {
    timeline: 'Jun 2021 — Sep 2024',
    currentPosition: 'Full Stack Developer',
    place: 'Qanta',
    previousPositions: [''],
    description:
      'At Qanta, I focused on building modern, responsive web applications using React and Next.js, translating detailed Figma designs into pixel-perfect, high-performance interfaces. Depending on each project’s needs, I worked with Strapi or WordPress on the backend and integrated GraphQL for efficient data communication. I also collaborated closely with designers and backend teams to ensure smooth content management workflows, fast page performance, and consistent design execution across multiple sites.',
    skills: [
      'Typescript',
      'JavaScript',
      'CSS',
      'Tailwind CSS',
      'MUI',
      'HTML',
      'Figma',
      'UI/UX Design',
      'Wordpress',
      'React',
      'Planning',
      'Docker',
      'Testing & QA',
    ],
  },
]

export default function ExpCard() {
  return (
    <section id='experience' className='scroll-mt-16 lg:mt-16'>
      <div className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest lg:sr-only'>
          Experience
        </h2>
      </div>
      <>
        {jobPositions.map((job, index) => (
          <Card
            key={index}
            className='lg:p-6 mb-4 flex flex-col lg:flex-row w-full min-h-fit gap-0 lg:gap-5 border-transparent hover:border dark:lg:hover:border-t-blue-900 dark:lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:hover:drop-shadow-lg lg:hover:bg-slate-100/50 lg:hover:border-t-blue-200'
          >
            <CardHeader className='h-full w-full p-0'>
              <CardTitle className='text-base text-slate-400 whitespace-nowrap'>
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
                  <Badge key={index}>{skill}</Badge>
                ))}
              </CardFooter>
            </CardContent>
          </Card>
        ))}
      </>
      <div className='lg:px-12 mt-12'>
        <a
          href='mailto:manuesteban1990@gmail.com'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center font-medium leading-tight text-foreground group'
        >
          <span className='border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none'>
            Reach out for Full Resume
          </span>
          <MoveRight className='ml-1 inline-block h-5 w-5 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none' />
        </a>
      </div>
    </section>
  )
}
