"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALE } from "@/utils/constants"
import { setLocale } from "@/utils/locales"
import { Languages } from "lucide-react"
import Flag from "react-world-flags"

const LocaleSwitcher = () => {
  const localSelect = (localeSelected) => () => {
    setLocale(localeSelected)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2">
          <Languages />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5}>
        {LOCALE.map(({ code, flagCode, name }) => (
          <DropdownMenuItem key={code} onSelect={localSelect(code)}>
            <button className="flex items-center gap-2">
              <Flag
                code={flagCode || code}
                className="h-6 w-6 rounded-sm object-fill"
              />
              {name}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LocaleSwitcher
