import { Toaster } from "@/components/ui/toaster"
import TanstackProvider from "@/providers/TanStackProvider"
import ThemeProvider from "@/providers/ThemeProvider"
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import localFont from "next/font/local"
import Script from "next/script"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { getLangDir } from "rtl-detect"
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
  const direction = getLangDir(local)

  return (
    <html lang={local} suppressHydrationWarning={true}>
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "flex min-h-screen flex-col items-center bg-background antialiased",
          direction === "rtl" ? "text-right" : "text-left",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <NextIntlClientProvider>
              <TanstackProvider>{children}</TanstackProvider>
            </NextIntlClientProvider>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster />
      </body>
      <Script
        async
        src={`${process.env.UMAMI_URL}/script.js`}
        data-website-id={process.env.UMAMI_WEBSITE_ID}
      />
    </html>
  )
}

export default RootLayout
