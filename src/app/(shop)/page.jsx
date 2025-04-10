/* eslint-disable new-cap */
"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CarouselPreview } from "@/features/carousel/components/CarouselPreview"
import { useCarousel } from "@/features/carousel/hooks/useCarousel"
import CategoriesItem from "@/features/categories/components/CategoriesItem"
import CardProduct from "@/features/products/components/CardProduct"
import { useNewProducts } from "@/features/products/hook/useNewProducts"
import { ArrowRight, Package } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const Home = () => {
  const t = useTranslations("HomePage")
  const { data: slides } = useCarousel()
  const { data: newProducts, isLoading: isNewProductsLoading } =
    useNewProducts()

  return (
    <main className="flex w-full flex-col items-center gap-8 space-y-10 sm:items-start">
      <div className="w-full">
        {slides ? (
          <CarouselPreview slides={slides} />
        ) : (
          <Skeleton className="h-[400px] w-full" />
        )}

        <div className="relative mt-4 w-full overflow-x-auto pb-4">
          <div className="flex min-w-max gap-2">
            {Array.from({ length: 20 }).map((_, index) => (
              <CategoriesItem key={index} />
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

        <div className="gird-cols-2 mt-3 grid w-full gap-4 md:grid-cols-4">
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
              <Button className="mt-2">{t("showAllServices")}</Button>
            </div>
          )}

          {isNewProductsLoading &&
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton className="h-[350px] w-auto" key={index} />
            ))}
        </div>
      </div>

      <Card className="mt-4 w-full p-5">
        <div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{t("aboutUs")}</h2>
            <div className="mb-1 mt-2 h-1 w-16 rounded-full bg-primary"></div>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1">
              <h3 className="mb-3 text-lg font-medium">{t("aboutUsTitle")}</h3>
              <p className="mb-4 leading-relaxed text-card-foreground">
                {t("aboutUsDesc1")}
              </p>
              <p className="mb-6 leading-relaxed text-card-foreground">
                {t("aboutUsDesc2")}
              </p>
              <div className="flex flex-col items-start justify-between md:flex-row">
                <div className="rounded border-l-4 border-primary bg-accent p-4">
                  <p className="font-medium text-accent-foreground">
                    {t("aboutPhrase")}
                  </p>
                </div>
                <Link href="https://cyna-it.fr/" target="_blank">
                  <Button
                    size="lg"
                    className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t("learnMore")} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}

export default Home
