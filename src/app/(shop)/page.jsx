/* eslint-disable new-cap */
"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CarouselPreview } from "@/features/carousel/components/CarouselPreview"
import { useCarousel } from "@/features/carousel/hooks/useCarousel"
import CategoriesItem from "@/features/categories/components/CategoriesItem"
import { useCategories } from "@/features/categories/hooks/useCategory"
import CardProduct from "@/features/products/components/CardProduct"
import { useNewProducts } from "@/features/products/hook/useNewProducts"
import SubscriptionsOffers from "@/features/subscriptions/components/SubscriptionsOffers"
import { Package } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const Home = () => {
  const t = useTranslations("HomePage")
  const { data: slides } = useCarousel()
  const { data: newProducts, isLoading: isNewProductsLoading } =
    useNewProducts()
  const { data: categories, isLoading: isCategoriesLoading } = useCategories({})

  return (
    <main className="flex w-full flex-col items-center gap-8 space-y-10 sm:items-start">
      <div className="w-full">
        {slides ? (
          <CarouselPreview slides={slides} />
        ) : (
          <Skeleton className="h-[400px] w-full" />
        )}

        <h2 className="mt-4 text-xl font-bold">{t("categories")}</h2>
        <div className="relative mt-4 w-full overflow-x-auto pb-4">
          <div className="flex min-w-max gap-2">
            {isCategoriesLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <Skeleton className="h-[70px] w-[150px]" key={index} />
              ))}

            {categories &&
              categories.data.map((category, index) => (
                <CategoriesItem key={index} category={category} />
              ))}
            <div className="scale-120 sticky -right-3 z-10 w-7 flex-1 bg-background blur-sm"></div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-4xl font-bold">{t("newProducts")}</h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-primary text-2xl"></div>
        </div>

        <div className="gird-cols-2 mt-3 grid w-full gap-4 md:grid-cols-3">
          {newProducts &&
            newProducts.data.map((product, index) => (
              <CardProduct key={index} product={product} />
            ))}

          {newProducts && (
            <div className="flex w-full flex-col items-center justify-center rounded-md border border-dashed py-8">
              <Package className="mb-2 h-12 w-12" />
              <h2 className="mb-2 border-dashed text-center text-xl font-bold">
                {t("discoverServices")}
              </h2>
              <Link href="/products">
                <Button className="mt-2">{t("showAllServices")}</Button>
              </Link>
            </div>
          )}

          {isNewProductsLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton className="h-[350px] w-auto" key={index} />
            ))}
        </div>
      </div>

      <div className="w-full">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-4xl font-bold">{t("subscriptions")}</h2>
          <div className="mt-2 h-1 w-16 rounded-full bg-primary text-2xl"></div>
        </div>

        <SubscriptionsOffers />
      </div>
    </main>
  )
}

export default Home
