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
import Link from "next/link"

const CartPage = () => {
  const { cartItems, totalPrice } = useCartStore()

  return (
    <div>
      <h1 className="text-3xl font-semibold">My Cart</h1>
      <div className="relative mt-2 flex gap-4">
        <div className="flex flex-1 flex-col gap-4">
          {cartItems.length === 0 && (
            <div className="mx-auto flex flex-1 flex-col items-center justify-center">
              <ShoppingBag className="h-16 w-16" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-sm">Add some products to your cart</p>
            </div>
          )}

          {cartItems.map((item, index) => (
            <CartRowProduct data={item} key={index} />
          ))}
        </div>
        <div className="flex-[0.5]">
          <Card className="sticky right-0 top-28">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Resume</CardTitle>
            </CardHeader>
            <CardContent className="space space-y-4 divide-y">
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
            <CardFooter className="flex w-full items-center justify-center">
              <Link href={"/payment"}>
                <Button size="lg">
                  Checkout <ShoppingCart />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartPage
