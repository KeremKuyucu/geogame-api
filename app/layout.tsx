import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeoGame API",
  description: "Coğrafya oyunu için API servisleri",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
        <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://raw.github.com/KeremKuyucu/GeoGame/main/assets/logo.png"
        />
        <meta name="theme-color" content="#4338ca" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
