"use client"

import logoDark from "@/assets/logoText-dark.png"
import logo from "@/assets/logoText.png"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { ThemeSwitcher } from "./ThemeSwitcher"

const Footer = () => {
  const t = useTranslations("Footer")
  const { theme } = useTheme()

  return (
    <footer className="hidden w-full bg-zinc-50 dark:bg-zinc-950 sm:block">
      <div className="mx-auto w-full max-w-screen-xl px-8 py-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse">
            <Image
              src={theme === "dark" ? logo : logoDark}
              className="mt-1 h-8 w-auto"
              alt="logo"
            />
          </a>
          <div className="flex items-center gap-3">
            <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400">
              <li>
                <Link href="/about" className="me-4 hover:underline md:me-6">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="#" className="me-4 hover:underline md:me-6">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="#" className="me-4 hover:underline md:me-6">
                  {t("cgu")}
                </Link>
              </li>
            </ul>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
