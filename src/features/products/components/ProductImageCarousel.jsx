"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { getProductImageUrl } from "../utils/image"

export function ProductImageCarousel({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-md bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex aspect-[4/3] gap-4 overflow-hidden">
      {images.length > 1 && (
        <div className="order-1 flex h-full w-24 flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {images.map((image, index) => (
            <button
              type="button"
              key={index}
              className={`relative aspect-square w-full flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex ? "border-primary" : "border-transparent"
              }`}
              onClick={() => goToSlide(index)}
            >
              <Image
                src={getProductImageUrl(image)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative order-2 aspect-[4/3] flex-1 overflow-hidden rounded-md">
        <Image
          src={getProductImageUrl(images[currentIndex])}
          alt={`Image ${currentIndex + 1}`}
          fill
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault()
              prevSlide()
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault()
              nextSlide()
            }}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next image</span>
          </Button>
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
