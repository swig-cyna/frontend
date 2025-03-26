"use client"

import logo from "@/assets/logoText.png"
import { Search, ShoppingCart, User2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import Headroom from "react-headroom"
import Burger from "./Burger"
import LocaleSwitcher from "./LocaleSwitcher"
import { Button } from "./ui/button"
import { signOut, useSession } from "@/features/auth/utils/authClient"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const t = useTranslations("Header")
  const { data: session } = useSession()

  return (
    <Headroom className="z-50 w-full">
      <div className="flex w-full justify-center border-b bg-card shadow-xl xl:mt-3 xl:border-0 xl:bg-transparent xl:shadow-none">
        <div className="flex h-16 w-full max-w-[1200px] items-center justify-between rounded-full px-4 xl:mx-8 xl:border xl:bg-card xl:shadow-md">
          <Link href="/">
            <Image src={logo} className="mt-1 h-8 w-auto" alt="logo" />
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              className="hidden w-40 justify-between rounded-full sm:flex"
            >
              <p>{t("search")}</p>
              <Search />
            </Button>

            <button className="sm:hidden">
              <Search />
            </button>

            <Link href="/cart">
              <ShoppingCart />
            </Link>
            <LocaleSwitcher />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link href="/">
                    <User2 />
                    <span className="sr-only">{t("userMenu")}</span>
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/account-management">{t("userSpace")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      onClick={async () => {
                        await signOut()
                      }}
                    >
                      {t("signout")}
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin">
                <Button className="rounded-full">{t("signin")}</Button>
              </Link>
            )}

            <Burger />
          </div>
        </div>
      </div>
    </Headroom>
  )
}

export default Header
