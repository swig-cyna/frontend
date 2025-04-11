"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import CardProduct from "@/features/products/components/CardProduct"
import ProductFilters from "@/features/products/components/ProductFilters"
import { useProducts } from "@/features/products/hook/useProducts"
import { useDebounce } from "@uidotdev/usehooks"
import { Filter, Loader2, SearchIcon, SlidersHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"
import { useState } from "react"

const ProductsPage = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" })
  const debouncedSearch = useDebounce(search, 300)
  const [sortOption, setSortOption] = useState("newest")
  const t = useTranslations("ProductsList")

  const [selectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  )
  const [range] = useQueryState(
    "range",
    parseAsArrayOf(parseAsInteger, ",").withDefault([0, 500]),
  )

  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20))
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  )

  const {
    data: products,
    isFetching,
    isLoading,
  } = useProducts({
    page: currentPage,
    limit,
    search: debouncedSearch,
    categories: selectedCategories,
    range,
    sortBy: sortOption,
  })

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto w-full px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <h1 className="text-2xl font-bold">{t("listOfProducts")}</h1>
            <div className="flex w-full items-center gap-2 md:w-auto">
              {isFetching && <Loader2 className="h-6 w-6 animate-spin" />}
              <div className="relative flex-1 md:w-80">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("searchProducts")}
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("filters")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>{t("filters")}</SheetTitle>
                  </SheetHeader>
                  <ProductFilters />
                </SheetContent>
              </Sheet>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <SelectValue placeholder="Trier par" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("sortNewest")}</SelectItem>
                  <SelectItem value="price-asc">{t("sortPriceAsc")}</SelectItem>
                  <SelectItem value="price-desc">
                    {t("sortPriceDesc")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {products && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {products.data.length} {t("productsFound")}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products?.data?.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))}
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton className="h-[350px]" key={i} />
              ))}
          </div>

          {products?.pagination?.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()

                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1)
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: products.pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(page)
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()

                        if (currentPage < products.pagination.totalPages) {
                          handlePageChange(currentPage + 1)
                        }
                      }}
                      className={
                        currentPage === products.pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProductsPage
