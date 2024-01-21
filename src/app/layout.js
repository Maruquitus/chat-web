import { Inter } from 'next/font/google'
import Script from 'next/script'
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

      <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
      
      </head>
      <body className={inter.className + ' flex w-screen h-screen select-none'}>{children}
      <Script strategy='lazyOnload' src="https://kit.fontawesome.com/11bac70e77.js" as='script' crossOrigin="anonymous"></Script></body>
    </html>
  )
}
