"use client"

import logo from "@/assets/logoText.png"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet"

const LinkBurger = ({ href, label, variant = "ghost", setOpen, ...props }) => (
  <Link href={href} onClick={() => setOpen(false)} {...props}>
    <Button variant={variant} className="w-full text-xl h-12">
      {label}
    </Button>
  </Link>
)
const Burger = () => {
  const [open, setOpen] = useState(false)
  const t = useTranslations("Burger")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="items-center">
          <Image src={logo} className="h-12 w-auto mt-1" alt="logo" />
        </SheetHeader>
        <div className="divide-y">
          <div className="grid space-y-2 py-4">
            <LinkBurger
              href="/signin"
              label={t("signin")}
              variant="default"
              setOpen={setOpen}
            />
          </div>

          <div className="grid space-y-2 py-4">
            <LinkBurger href="/" label={t("home")} setOpen={setOpen} />
            <LinkBurger
              href="/categories"
              label={t("categories")}
              setOpen={setOpen}
            />
          </div>

          <div className="grid space-y-2 py-4">
            <LinkBurger href="/about" label={t("about")} setOpen={setOpen} />
            <LinkBurger
              href="/contact"
              label={t("contact")}
              setOpen={setOpen}
            />
            <LinkBurger href="/cgu" label={t("cgu")} setOpen={setOpen} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Burger
