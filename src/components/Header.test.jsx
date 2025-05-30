import { signOut, useSession } from "@/features/auth/utils/authClient"
import useCartStore from "@/features/cart/stores/cartStore"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import Header from "./Header"

vi.mock("react-headroom", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}))

describe("Header Component", () => {
  beforeEach(() => {
    useSession.mockReturnValue({ data: null })
    useCartStore.mockReturnValue({
      cartItems: [],
      totalItems: 0,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("renders logo and navigation links", () => {
    render(<Header />)

    const logo = screen.getByAltText("logo")
    expect(logo).toBeInTheDocument()

    const productsLink = screen.getByRole("link", { name: /search/iu })
    expect(productsLink).toBeInTheDocument()

    const cartLink = screen.getByRole("cart")
    expect(cartLink).toBeInTheDocument()

    const signinButton = screen.getByRole("button", { name: /signin/iu })
    expect(signinButton).toBeInTheDocument()
  })

  test("shows cart item count when items are in cart", () => {
    useCartStore.mockReturnValue({
      cartItems: [{ id: 1, quantity: 2 }],
      totalItems: 2,
    })

    render(<Header />)

    const cartBadge = screen.getByText("2")
    expect(cartBadge).toBeInTheDocument()
    expect(cartBadge).toHaveClass("bg-red-600")
  })

  test("shows user menu when user is logged in", () => {
    useSession.mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          role: "user",
        },
      },
    })

    render(<Header />)

    const userIcon = screen.getByRole("link", { name: /userMenu/iu })
    expect(userIcon).toBeInTheDocument()

    const signInButton = screen.queryByRole("button", { name: /signin/iu })
    expect(signInButton).not.toBeInTheDocument()
  })

  test("shows admin menu when user is admin", async () => {
    const user = userEvent.setup()

    useSession.mockReturnValue({
      data: {
        user: {
          email: "admin@example.com",
          role: "admin",
        },
      },
    })

    render(<Header />)

    // Ouvre le menu déroulant
    const userIcon = screen.getByRole("link", { name: /userMenu/iu })
    await user.click(userIcon)

    await waitFor(() => {
      const backofficeLink = screen.getByRole("menuitem", {
        name: /backoffice/iu,
      })
      expect(backofficeLink).toBeInTheDocument()
    })
  })

  test("handles sign out", async () => {
    const user = userEvent.setup()

    useSession.mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          role: "user",
        },
      },
    })

    signOut.mockResolvedValue()

    render(<Header />)

    const userTrigger = screen.getByRole("link", { name: /userMenu/iu })
    expect(userTrigger).toBeInTheDocument()

    await user.click(userTrigger)

    await waitFor(() => {
      const signOutButton = screen.getByRole("menuitem", { name: /signout/iu })
      expect(signOutButton).toBeInTheDocument()
    })

    const signOutButton = screen.getByRole("menuitem", { name: /signout/iu })

    await user.click(signOutButton)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
    })
  })
})
