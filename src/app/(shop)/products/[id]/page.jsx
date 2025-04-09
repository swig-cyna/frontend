"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useCartStore from "@/features/cart/stores/cartStore"
import { ProductImageCarousel } from "@/features/products/components/ProductImageCarousel"
import { useProduct } from "@/features/products/hook/useProducts"
import { toast } from "@/hooks/useToast"
import { Loader2, ShoppingCart } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useState } from "react"

const ProductPage = () => {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations("Product")
  const tFormat = useFormatter()
  const { data: product, isLoading } = useProduct(params.id)
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      images: product.images,
    })

    toast({
      title: t("addProductToastTitle"),
      description: t("addProductToastDescription"),
    })
  }

  const handleQuantityChange = (e) => {
    const { value } = e.target

    if (value < 1) {
      setQuantity(1)

      return
    }

    setQuantity(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      <div className="flex-1">
        <ProductImageCarousel images={product.images} />
      </div>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm">{product.description}</pre>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div>
              <p className="text-2xl font-semibold">
                {tFormat.number(product.price, {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
            <div className="mt-2 flex w-full justify-between">
              <Input
                type="number"
                className="h-10 w-24 text-lg"
                defaultValue={1}
                min={1}
                value={quantity}
                placeholder="Quantity"
                onChange={handleQuantityChange}
              />
              <Button size="lg" onClick={handleAddToCart}>
                {t("addToCart")} <ShoppingCart />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ProductPage
