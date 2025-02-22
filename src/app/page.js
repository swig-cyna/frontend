/* eslint-disable new-cap */
"use client"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import CardProduct from "@/features/products/components/CardProduct"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex flex-col gap-8 items-center sm:items-start w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 15000,
          }),
        ]}
        className="min-w-full max-w-sm rounded-lg overflow-hidden"
      >
        <CarouselContent className="ml-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem className="pl-0" key={index}>
              <div className="flex flex-col justify-center items-start py-6 px-12 pb-8 h-64 md:h-72 relative">
                <h2 className="text-3xl font-semibold text-white drop-shadow-md">
                  Slide {index + 1}
                </h2>
                <p className="drop-shadow-md">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit
                </p>
                <Button className="mt-4">Read more</Button>
                <Image
                  src="https://picsum.photos/700/500"
                  alt="logo"
                  fill
                  className="absolute top-0 -z-10 h-screen w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-2 border-none bg-background/20" />
        <CarouselPrevious className="left-2 border-none bg-background/20" />
      </Carousel>

      <div className="w-full grid gap-4 gird-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardProduct key={index} />
        ))}
      </div>
    </main>
  )
}
