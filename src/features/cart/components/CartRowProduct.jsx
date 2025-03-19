import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    <Card className="p-2 grid grid-cols-[100px_1fr_auto] items-center">
      <Image
        className="rounded-lg"
        src="https://picsum.photos/500/500"
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
      <div className="flex gap-2 items-end flex-col">
        <Input
          type="number"
          size="sm"
          className="w-16"
          onChange={onQuantityChange}
          value={quantity}
          min={1}
        />
        <p className="font-semibold text-2xl">$ {data.price}</p>
      </div>
    </Card>
  )
}

export default CartRowProduct
