"use client"

import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { getSlideImageUrl } from "../utils/image"

export function CarouselPreview({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === sortedSlides.length - 1 ? 0 : prev + 1))
  }, [sortedSlides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sortedSlides.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (!autoplay || sortedSlides.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval)
  }, [autoplay, currentSlide, sortedSlides.length, nextSlide])

  useEffect(() => {
    if (currentSlide >= sortedSlides.length) {
      setCurrentSlide(0)
    }
  }, [sortedSlides, currentSlide])

  if (sortedSlides.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
        <p className="text-center text-muted-foreground">
          No slides to display. Add slides to preview the carousel.
        </p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-10 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      <div className="relative h-[400px] w-full">
        {sortedSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div className="relative h-full w-full">
              {slide.image ? (
                <Image
                  src={getSlideImageUrl(slide.image)}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <ImagePlus className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{slide.title}</h3>
                <p className="mt-2 max-w-md">{slide.description}</p>
                {slide.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                    asChild
                  >
                    <a
                      href={slide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {sortedSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${index === currentSlide ? "w-6 bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>

      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => setAutoplay(!autoplay)}
        >
          {autoplay ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  )
}
