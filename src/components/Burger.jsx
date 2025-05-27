"use client"

import logoDark from "@/assets/logoText-dark.png"
import logo from "@/assets/logoText.png"
import { signOut, useSession } from "@/features/auth/utils/authClient"
import { Menu, User2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet"

const LinkBurger = ({ href, label, variant = "ghost", setOpen, ...props }) => (
  <Link href={href} onClick={() => setOpen(false)} {...props}>
    <Button variant={variant} className="h-12 w-full text-xl">
      {label}
    </Button>
  </Link>
)
const Burger = () => {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const t = useTranslations("Burger")
  const { data: session } = useSession()
  const router = useRouter()

  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.role === "superadmin" ||
    session?.user?.role === "support"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="items-center">
          <Image
            src={theme === "light" ? logoDark : logo}
            className="mt-1 h-12 w-auto"
            alt="logo"
          />
        </SheetHeader>
        <nav>
          <div className="divide-y">
            <div className="grid space-y-2 py-4">
              {session ? (
                <LinkBurger
                  href="/user/account-management"
                  label={
                    <>
                      <User2 className="mr-2" />
                      {session.user.name}
                    </>
                  }
                  setOpen={setOpen}
                />
              ) : (
                <LinkBurger
                  href="/signin"
                  label={t("signin")}
                  variant="default"
                  setOpen={setOpen}
                />
              )}
            </div>

            <div className="grid space-y-2 py-4">
              <LinkBurger href="/" label={t("home")} setOpen={setOpen} />
              <LinkBurger
                href="/products"
                label={t("products")}
                setOpen={setOpen}
              />
            </div>

            {session && isAdmin && (
              <div className="grid space-y-2 py-4">
                <LinkBurger
                  href="/admin"
                  label={t("backoffice")}
                  setOpen={setOpen}
                />
              </div>
            )}

            <div className="grid space-y-2 py-4">
              <LinkBurger href="/about" label={t("about")} setOpen={setOpen} />
              <LinkBurger
                href="/contact"
                label={t("contact")}
                setOpen={setOpen}
              />
              <LinkBurger href="/cgu" label={t("cgu")} setOpen={setOpen} />
            </div>

            {session && (
              <div className="grid space-y-2 py-4">
                <Button
                  variant="ghost"
                  className="px-8 py-6 text-base hover:bg-red-500/20 hover:text-white"
                  onClick={async () => {
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/")
                        },
                      },
                    })
                    setOpen(false)
                  }}
                >
                  {t("signout")}
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default Burger
