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

const RootLayout = async ({ children }) => {
  const local = await getLocale()

  return (
    <html lang={local} suppressHydrationWarning={true}>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased bg-background flex min-h-screen items-center flex-col",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <TanstackProvider>{children}</TanstackProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
