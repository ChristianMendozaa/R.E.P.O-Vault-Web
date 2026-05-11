import type { Metadata } from 'next'
import { JetBrains_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'R.E.P.O Vault',
  description: 'Web save editor for R.E.P.O — edit crew stats, inventory, and run data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}
