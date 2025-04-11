"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SheetFooter } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { useTranslations } from "next-intl"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"

// Données fictives pour les filtres
const categories = [
  { id: "electronics", name: "Électronique" },
  { id: "fashion", name: "Mode" },
  { id: "home", name: "Maison" },
  { id: "sports", name: "Sports & Loisirs" },
  { id: "beauty", name: "Beauté & Santé" },
  { id: "food", name: "Alimentation" },
]

export default function ProductFilters() {
  const t = useTranslations("ProductsList")

  const [range, setRange] = useQueryState(
    "range",
    parseAsArrayOf(parseAsInteger, ",").withDefault([0, 500]),
  )

  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  )

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(updatedCategories)
  }

  const handlePriceChange = (value) => {
    setRange(value)
  }

  const resetFilters = () => {
    setSelectedCategories(null)
    setRange(null)
  }

  return (
    <div className="h-[calc(100vh-8rem)] overflow-auto overflow-x-hidden py-4">
      <div className="space-y-6">
        <Accordion
          type="multiple"
          defaultValue={["categories", "price", "brands", "rating"]}
          className="w-full"
        >
          <AccordionItem value="categories">
            <AccordionTrigger>{t("categories")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>{t("priceRange")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={range}
                  min={0}
                  max={500}
                  step={10}
                  value={range}
                  onValueChange={handlePriceChange}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">{range[0]} €</span>
                  <span className="text-sm">{range[1]} €</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <SheetFooter className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          {t("resetFilters")}
        </Button>
      </SheetFooter>
    </div>
  )
}
