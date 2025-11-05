import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://angstromico-cv-manuel-morales.netlify.app'),
  alternates: {
    canonical: 'https://angstromico-cv-manuel-morales.netlify.app',
  },
  title: 'Manuel Morales - Product Designer in AI, Web3, and Finance',
  description: 'Manuel Morales is a Product designer, developer & founder.',
  keywords:
    'Manuel Morales, Product Designer, AI, Web3, Finance, User Experience, UI/UX Design, Design Systems, Front-end Development, Decentralized Finance, DeFi, Swoop Exchange, Vela Exchange, Stealth AI Startup, Technology, Innovation, Human-Centered Design',
  openGraph: {
    locale: 'en_US',
    siteName: 'Manuel Morales',
    type: 'website',
    title: 'Manuel Morales',
    description: 'Manuel Morales is a Product designer, developer & founder.',
    url: 'https://angstromico-cv-manuel-morales.netlify.app',
    images: [
      {
        url: './morales.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manuel Morales',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
