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
import CartRowProduct from "@/features/cart/components/CartRowProduct"
import useCartStore from "@/features/cart/stores/cartStore"
import { ShoppingBag, ShoppingCart } from "lucide-react"

const CartPage = () => {
  const { cartItems, totalPrice } = useCartStore()

  return (
    <div>
      <h1 className="text-3xl font-semibold">My Cart</h1>
      <div className="flex gap-4 mt-2 relative">
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.length === 0 && (
            <div className="mx-auto flex-1 flex flex-col justify-center items-center">
              <ShoppingBag className="w-16 h-16" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-sm">Add some products to your cart</p>
            </div>
          )}

          {cartItems.map((item, index) => (
            <CartRowProduct data={item} key={index} />
          ))}
        </div>
        <div className="flex-[0.5]">
          <Card className="sticky top-28 right-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 space divide-y ">
              <div>
                <h2>Subtotal</h2>
                <p className="text-4xl font-semibold">$ {totalPrice}</p>
              </div>

              <div className="pt-4">
                <h2>Discount Code</h2>
                <Input className="mt-3" placeholder="Enter discount code" />
              </div>

              <div className="pt-4">
                <h2>Address</h2>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center w-full">
              <Button size="lg">
                Checkout <ShoppingCart />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage
