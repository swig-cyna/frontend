import "@testing-library/jest-dom"
import { vi } from "vitest"

vi.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props) => <img {...props} />,
}))

vi.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useFormatter: () => ({
    number: (value, options) => {
      return new Intl.NumberFormat('fr-FR', options).format(value)
    }
  }),
  __esModule: true,
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}))

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
}

const mockUsePathname = vi.fn()
const mockUseSearchParams = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}))

vi.mock("@/features/cart/stores/cartStore", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    cartItems: [],
    totalItems: 0,
  })),
}))

vi.mock("@/features/auth/utils/authClient", () => ({
  useSession: vi.fn(),
  signOut: vi.fn().mockResolvedValue({}),
}))

global.vi = vi
