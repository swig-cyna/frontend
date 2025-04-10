import logo from "@/assets/logoText.png"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  const t = useTranslations("Footer")

  return (
    <footer className="hidden w-full bg-zinc-950 sm:block">
      <div className="mx-auto w-full max-w-screen-xl px-8 py-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a className="mb-4 flex items-center space-x-3 sm:mb-0 rtl:space-x-reverse">
            <Image src={logo} className="mt-1 h-8 w-auto" alt="logo" />
          </a>
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
        </div>
      </div>
    </footer>
  )
}

export default Footer
