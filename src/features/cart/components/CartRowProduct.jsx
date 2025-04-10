"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getProductImageUrl } from "@/features/products/utils/image"
import { Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import useCartStore from "../stores/cartStore"

const CartRowProduct = ({ data }) => {
  const { removeItem, updateQuantity } = useCartStore()

  const [quantity, setQuantity] = useState(data.quantity)

  const onQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10)

    setQuantity(newQuantity)

    if (isNaN(newQuantity)) {
      return
    }

    updateQuantity(data.id, newQuantity)
  }

  return (
    <Card className="grid grid-cols-[100px_1fr_auto] items-center p-2">
      <Image
        className="rounded-lg"
        src={getProductImageUrl(data.images[0])}
        alt="product"
        width={80}
        height={80}
      />
      <div>
        <h2 className="text-xl font-semibold">{data.name}</h2>
        <Button onClick={() => removeItem(data.id)} variant="ghost" size="sm">
          <Trash /> Remove
        </Button>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Input
          type="number"
          size="sm"
          className="w-16"
          onChange={onQuantityChange}
          value={quantity}
          min={1}
        />
        <p className="text-2xl font-semibold">$ {data.price}</p>
      </div>
    </Card>
  )
}

export default CartRowProduct
