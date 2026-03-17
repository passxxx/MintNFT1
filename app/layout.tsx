import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Base Mini NFT',
  description: 'Mint NFTs on Base blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="bc_0gzcyaft" />
        <script
          src="https://base.org/attribution.js"
          data-encoded="0x62635f30677a63796166740b0080218021802180218021802180218021"
          async
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
