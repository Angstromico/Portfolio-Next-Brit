'use client'
/* eslint-disable */

export default function About() {
  return (
    <section id='about' className='scroll-mt-16'>
      <div className='sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0'>
        <h2 className='text-sm font-bold uppercase tracking-widest lg:sr-only'>
          About
        </h2>
      </div>

      <div className='flex flex-col gap-4'>
        <p className='text-start text-muted-foreground lg:px-6'>
          From backend logic to interface design, my work has always been driven
          by one goal —{' '}
          <span className='text-white'>
            making technology feel fluid, human, and meaningful.
          </span>{' '}
          I move comfortably between code and design, crafting experiences that
          connect functionality with emotion.
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          My journey has taken me through projects that bridge creativity and
          precision — from building{' '}
          <a
            className='no-wrap text-primary dark:text-white'
            href='https://miafemtech.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Mia Femtech
          </a>
          , a multilingual platform empowering women’s health, to designing the{' '}
          <a
            className='no-wrap text-primary dark:text-white'
            href='#'
            target='_blank'
            rel='noopener noreferrer'
          >
            GamifyMex
          </a>{' '}
          experience, where gaming and interactivity meet modern UI/UX design.
          I’ve also developed{' '}
          <span className='text-white'>custom WordPress plugins</span>,
          integrating APIs, real-time data, and AI features to create smarter
          tools for both users and developers.
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          With a foundation in{' '}
          <span className='text-white'>
            React, Astro, Tailwind, and Laravel
          </span>
          , I’ve helped shape products that balance strong engineering with
          intuitive design. Whether leading a frontend migration, optimizing API
          performance, or refining visual details from Figma to production, I
          focus on clarity, usability, and impact.
        </p>

        <p className='text-start text-muted-foreground lg:px-6'>
          I believe technology should feel seamless —{' '}
          <span className='text-white'>
            an invisible partner that enhances how we create, learn, and
            interact.
          </span>{' '}
          Every project I work on is a step toward that vision: elegant,
          intelligent, and accessible digital experiences built for real people.
        </p>
      </div>
    </section>
  )
}
