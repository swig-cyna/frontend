/* eslint-disable new-cap */
"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { CarouselPreview } from "@/features/carousel/components/CarouselPreview"
import { useCarousel } from "@/features/carousel/hooks/useCarousel"
import CategoriesItem from "@/features/categories/components/CategoriesItem"
import CardProduct from "@/features/products/components/CardProduct"
import { useTranslations } from "next-intl"

const Home = () => {
  const t = useTranslations("HomePage")
  const { data: slides } = useCarousel()

  return (
    <main className="flex w-full flex-col items-center gap-8 sm:items-start">
      <div className="w-full">
        {slides ? (
          <CarouselPreview slides={slides} />
        ) : (
          <Skeleton className="h-[400px] w-full" />
        )}
      </div>

      <div className="w-full">
        <h2 className="mb-2 text-xl font-semibold">{t("categories")}</h2>
        <div className="relative w-full overflow-x-auto pb-4">
          <div className="flex min-w-max gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <CategoriesItem key={index} />
            ))}
            <div className="sticky -right-3 z-10 w-7 flex-1 scale-150 bg-background blur-sm"></div>
          </div>
        </div>
        <div className="gird-cols-2 mt-3 grid w-full gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardProduct key={index} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home
