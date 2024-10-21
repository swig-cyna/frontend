"use client"

import logo from "@/assets/logoText.png"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet"

const LinkBurger = ({ href, label, variant = "ghost", setOpen, ...props }) => {
  return (
    <Link href={href} onClick={() => setOpen(false)} {...props}>
      <Button variant={variant} className="w-full text-xl h-12">
        {label}
      </Button>
    </Link>
  )
}

const Burger = () => {
  const [open, setOpen] = useState(false)
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
              label="Sign in"
              variant="default"
              setOpen={setOpen}
            />
          </div>

          <div className="grid space-y-2 py-4">
            <LinkBurger href="/" label="Home" setOpen={setOpen} />
            <LinkBurger
              href="/categories"
              label="Categories"
              setOpen={setOpen}
            />
          </div>

          <div className="grid space-y-2 py-4">
            <LinkBurger href="/about" label="About" setOpen={setOpen} />
            <LinkBurger href="/contact" label="Contact" setOpen={setOpen} />
            <LinkBurger href="/cgu" label="CGU" setOpen={setOpen} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Burger
