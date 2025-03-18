"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import TanstackProvider from "@/providers/TanStackProvider"
import ThemeProvider from "@/providers/ThemeProvider"
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata = {
  title: "Cyna Marketplace",
  description: "Cyna Marketplace",
}

export default function RootLayout({ children }) {
  const local = getLocale()

  return (
    <html lang={local}>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased bg-background flex min-h-screen items-center flex-col"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <TanstackProvider>
              <Header />
              <div className="flex flex-col justify-items-center h-full flex-1 p-8 max-w-[1200px] w-full font-[family-name:var(--font-geist-sans)]">
                {children}
              </div>
              <Footer />
            </TanstackProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
