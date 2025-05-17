"use client"

import logo from "@/assets/logoText.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "@/features/auth/utils/authClient"
import useCartStore from "@/features/cart/stores/cartStore"
import { Search, ShoppingCart, User2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Headroom from "react-headroom"
import Burger from "./Burger"
import LocaleSwitcher from "./LocaleSwitcher"
import { Button } from "./ui/button"

const Header = () => {
  const t = useTranslations("Header")
  const { data: session } = useSession()
  const router = useRouter()
  const { cartItems } = useCartStore()
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.role === "superadmin" ||
    session?.user?.role === "support"

  return (
    <Headroom className="z-50 w-full">
      <div className="flex w-full justify-center border-b bg-card shadow-xl xl:mt-3 xl:border-0 xl:bg-transparent xl:shadow-none">
        <div className="flex h-16 w-full max-w-[1200px] items-center justify-between rounded-full px-4 xl:mx-8 xl:border xl:bg-card xl:shadow-md">
          <Link href="/">
            <Image src={logo} className="mt-1 h-8 w-auto" alt="logo" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button
                variant="secondary"
                className="hidden w-40 justify-between rounded-full sm:flex"
              >
                <p>{t("search")}</p>
                <Search />
              </Button>
            </Link>

            <Link className="sm:hidden" href="/products">
              <Search />
            </Link>

            <Link href="/cart">
              <div className="relative">
                <ShoppingCart />
                {Boolean(totalItems) && (
                  <span className="outline-3 absolute -bottom-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 pt-[1px] text-xs font-bold text-white outline outline-card">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
            <LocaleSwitcher />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Link href="/">
                    <User2 />
                    <span className="sr-only">{t("userMenu")}</span>
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/user/account-management">
                      {t("userSpace")}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin">{t("backoffice")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.push("/")
                          },
                        },
                      })
                    }}
                  >
                    {t("signout")}
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
