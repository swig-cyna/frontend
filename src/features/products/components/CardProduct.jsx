"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFormatter, useTranslations } from "next-intl"
import Image from "next/image"

const CardProduct = () => {
  const t = useTranslations("ProductCard")
  const tFormat = useFormatter()

  return (
    <Card className="overflow-hidden">
      <Image
        src="https://picsum.photos/700/500"
        alt="logo"
        width={700}
        height={500}
      />
      <CardContent className="pt-4">
        <h2 className="text-xl font-semibold">Product name</h2>
        <p className="text-sm">Lorem ipsum dolor sit amet consectetur</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold">
            {tFormat.number(99.99, { style: "currency", currency: "EUR" })}
          </p>
          <Button size="sm">{t("showMore")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardProduct
