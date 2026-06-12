import type { Metadata } from 'next'
import { Playfair_Display, Epilogue } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-epilogue',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Saylo — Own the Room',
  description:
    'Saylo joins your meetings silently, analyzes your voice, expressions, and presence in real time — and delivers the honest report your colleagues will never give you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${epilogue.variable}`}>
      <body>{children}</body>
    </html>
  )
}
