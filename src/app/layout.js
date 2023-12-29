import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chat Web',
  description: 'Aplicação de chat para web',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
      <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
      
      </head>
      <body className={inter.className + ' flex w-screen h-screen'}>{children}
      z<script src="https://kit.fontawesome.com/11bac70e77.js" crossOrigin="anonymous"></script></body>
    </html>
  )
}
