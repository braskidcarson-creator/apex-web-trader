import './globals.css'

export const metadata = {
  title: 'ApexWeb Trader | Direct API Execution',
  description: 'Deployable Vercel Web Trading Engine',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
