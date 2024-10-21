import logo from "@/assets/logoText.png"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-zinc-950 w-full hidden sm:block">
      <div className="w-full max-w-screen-xl mx-auto py-4 px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <Image src={logo} className="h-8 w-auto mt-1" alt="logo" />
          </a>
          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400">
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                CGU
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
