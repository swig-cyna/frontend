import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import LocaleSwitcher from "./LocaleSwitcher"
import * as locales from "@/utils/locales"
import { LOCALE } from "@/utils/constants"

vi.mock("react-world-flags", () => ({
  __esModule: true,
  default: ({ code, className }) => (
    <img 
      src={`/flags/${code}.svg`} 
      alt={code} 
      className={className}
      data-testid={`flag-${code}`}
    />
  )
}))

vi.mock("@/utils/locales", () => ({
  setLocale: vi.fn(),
  __esModule: true,
}))

describe("LocaleSwitcher Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("displays language switch button", () => {
    render(<LocaleSwitcher />)
    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toContainHTML("languages")
  })

  test("displays dropdown with available languages", async () => {
    const user = userEvent.setup()
    render(<LocaleSwitcher />)
    
    const button = screen.getByRole("button")
    await user.click(button)
    
    LOCALE.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })

  test("calls setLocale with correct language code on selection", async () => {
    const user = userEvent.setup()
    render(<LocaleSwitcher />)
    
    const button = screen.getByRole("button")
    await user.click(button)
    
    const firstLanguage = screen.getByText(LOCALE[0].name)
    await user.click(firstLanguage)
    
    expect(locales.setLocale).toHaveBeenCalledWith(LOCALE[0].code)
  })

  test("displays flags for all languages with correct codes", async () => {
    const user = userEvent.setup()
    render(<LocaleSwitcher />)
    
    const button = screen.getByRole("button")
    await user.click(button)
    
    LOCALE.forEach(({ flagCode, code }) => {
      const expectedCode = flagCode || code
      const testId = `flag-${expectedCode}`
      const flagElement = screen.getByTestId(testId)
      
      expect(flagElement).toBeInTheDocument()
      expect(flagElement).toHaveAttribute('src', expect.stringContaining(`/${expectedCode}.svg`))
      expect(flagElement).toHaveClass('h-6 w-6 rounded-sm object-fill')
    })
  })
})
