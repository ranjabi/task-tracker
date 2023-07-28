import type { Metadata } from 'next'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'Task Tracker',
  description: 'Track your tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
