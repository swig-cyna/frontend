"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

export const ComboboxUser = React.forwardRef(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select a user...",
      open: controlledOpen,
      onOpenChange: controlledOnOpenChange,
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
    const open =
      controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = controlledOnOpenChange || setUncontrolledOpen

    const [search, setSearch] = React.useState("")
    const inputRef = React.useRef(null)

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    )

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                    setSearch("")
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === option.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

ComboboxUser.displayName = "ComboboxUser"
