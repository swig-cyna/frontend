"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFormatter, useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { getProductImageUrl } from "../utils/image"

const CardProduct = ({ product }) => {
  const t = useTranslations("ProductCard")
  const tFormat = useFormatter()

  return (
    <Card className="overflow-hidden">
      <Image
        className="h-[300px] w-full object-cover"
        src={getProductImageUrl(product.images[0])}
        alt="logo"
        width={700}
        height={500}
      />
      <CardContent className="pt-4">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">
            {tFormat.number(product.price, {
              style: "currency",
              currency: "EUR",
            })}
          </p>
          <Link href={`/products/${product.id}`}>
            <Button size="sm">{t("showMore")}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardProduct
