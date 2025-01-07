import { Metadata } from 'next'
import { DataProvider } from '@/components/DataProvider';

export const metadata: Metadata = {
  title: 'My Sheet Data App',
  description: 'An application to display Google Sheet data',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  )
}


import './globals.css'