import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import CardProduct from "./CardProduct"


vi.mock("../utils/image", () => ({
  getProductImageUrl: (id) => `/mocked-url/${id}`,
  __esModule: true,
}))

describe("CardProduct Component", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 29.99,
    images: ["image1.jpg", "image2.jpg"],
  }

  const mockProductWithoutImages = {
    id: "2",
    name: "No Image Product",
    price: 19.99,
    images: [],
  }

  test("renders product with image", () => {
    render(<CardProduct product={mockProduct} />)
    
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("29,99 €")).toBeInTheDocument()
    
    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("src", "/mocked-url/image1.jpg")
    
    expect(screen.getByRole("link")).toHaveAttribute("href", "/products/1")
    expect(screen.getByRole("button", { name: /showMore/i })).toBeInTheDocument()
  })

  test("renders fallback when no images are available", () => {
    render(<CardProduct product={mockProductWithoutImages} />)
    
    expect(screen.getByText("No images available")).toBeInTheDocument()
    
    const imageOffIcon = document.querySelector('.lucide-image-off')
    expect(imageOffIcon).toBeInTheDocument()
    expect(imageOffIcon).toHaveClass('h-16', 'w-16')
  })
})
