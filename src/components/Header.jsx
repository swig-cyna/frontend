"use client"

import logo from "@/assets/logoText.png"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Headroom from "react-headroom"
import Burger from "./Burger"
import { Button } from "./ui/button"

const Header = () => {
  return (
    <Headroom className="z-50 w-full">
      <div className="bg-card xl:bg-transparent xl:mt-3 flex justify-center w-full border-b xl:border-0 xl:shadow-none shadow-xl">
        <div className="max-w-[1200px] h-16 px-4 xl:mx-8 flex w-full justify-between items-center rounded-full xl:bg-card xl:border xl:shadow-xl">
          <Link href="/">
            <Image src={logo} className="h-8 w-auto mt-1" alt="logo" />
          </Link>
          <div className="flex gap-4 items-center">
            <Button
              variant="secondary"
              className="rounded-full w-40 justify-between hidden sm:flex"
            >
              <p>Search</p>
              <Search />
            </Button>

            <button className="sm:hidden">
              <Search />
            </button>

            <button>
              <ShoppingCart />
            </button>
            <Link href="/signin">
              <Button className="rounded-full">Sign in</Button>
            </Link>
            <Burger />
          </div>
        </div>
      </div>
    </Headroom>
  )
}

export default Header
