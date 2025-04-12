"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

const CategoriesItem = ({ category }) => {
  const t = useTranslations("Category")

  return (
    <Link
      href={category.id ? `/products?categories=${category.id}` : ""}
      className="group brightness-110 transition-all"
    >
      <div
        className="relative flex min-w-24 items-center justify-center overflow-hidden rounded-lg group-hover:brightness-110"
        style={{ backgroundColor: category.color }}
      >
        <div className="z-10 m-[1px] rounded-lg bg-card px-6 py-2">
          <p className="font-semibold drop-shadow-md">
            {category.name || "Category Name"}
          </p>
          <p className="text-xs drop-shadow-md">
            {category.count} {t("products")}
          </p>
        </div>
      </div>
    </Link>
  )
}
export default CategoriesItem
