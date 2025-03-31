"use client"

import { DragDropContext } from "@hello-pangea/dnd"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/useToast"
import { AddSlideDialog } from "./AddSlideDialog"
import { CarouselPreview } from "./CarouselPreview"
import { DeleteSlideDialog } from "./DeleteSlideDialog"
import { EditSlideDialog } from "./EditSlideDialog"
import { SlideList } from "./SideList"

const initialSlides = [
  {
    id: "1",
    title: "New Electronic Products",
    description: "Discover our new range of high-end electronic products.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=Electronics",
    order: 0,
  },
  {
    id: "2",
    title: "Summer Special Offers",
    description: "Enjoy our summer special offers with up to 30% discount.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    link: "/promotions",
    order: 1,
  },
  {
    id: "3",
    title: "Premium Audio Collection",
    description:
      "Explore our collection of audio products for an exceptional sound experience.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=Audio",
    order: 2,
  },
]

export function CarouselManager() {
  const [slides, setSlides] = useState(initialSlides)
  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false)
  const [slideToEdit, setSlideToEdit] = useState(null)
  const [slideToDelete, setSlideToDelete] = useState(null)
  const { toast } = useToast()

  const handleAddSlide = (newSlide) => {
    const id = (slides.length + 1).toString()
    const order = slides.length

    setSlides([...slides, { ...newSlide, id, order }])
    setIsAddSlideOpen(false)

    toast({
      title: "Slide Added",
      description: "The slide has been successfully added to the carousel.",
    })
  }

  const handleUpdateSlide = (updatedSlide) => {
    setSlides(
      slides.map((slide) =>
        slide.id === updatedSlide.id ? updatedSlide : slide,
      ),
    )
    setSlideToEdit(null)

    toast({
      title: "Slide Updated",
      description: "The slide has been successfully updated.",
    })
  }

  const handleDeleteSlide = (slideId) => {
    const newSlides = slides.filter((slide) => slide.id !== slideId)
    const reorderedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index,
    }))

    setSlides(reorderedSlides)
    setSlideToDelete(null)

    toast({
      title: "Slide Deleted",
      description: "The slide has been successfully removed from the carousel.",
    })
  }

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(slides)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const reorderedSlides = items.map((slide, index) => ({
      ...slide,
      order: index,
    }))

    setSlides(reorderedSlides)

    toast({
      title: "Order Updated",
      description: "The order of slides has been successfully updated.",
    })
  }

  return (
    <div className="space-y-6">
      <TabsContent value="list" className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setIsAddSlideOpen(true)}>
            <PlusCircle className="mr-1 h-4 w-4" />
            Add Slide
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <SlideList
            slides={slides}
            onEdit={setSlideToEdit}
            onDelete={setSlideToDelete}
          />
        </DragDropContext>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Carousel Preview</CardTitle>
            <CardDescription>
              Preview of the carousel display in homepage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarouselPreview slides={slides} />
          </CardContent>
        </Card>
      </TabsContent>

      <AddSlideDialog
        open={isAddSlideOpen}
        onOpenChange={setIsAddSlideOpen}
        onAddSlide={handleAddSlide}
      />

      {slideToEdit && (
        <EditSlideDialog
          slide={slideToEdit}
          open={Boolean(slideToEdit)}
          onOpenChange={(open) => !open && setSlideToEdit(null)}
          onUpdateSlide={handleUpdateSlide}
        />
      )}

      {slideToDelete && (
        <DeleteSlideDialog
          slide={slideToDelete}
          open={Boolean(slideToDelete)}
          onOpenChange={(open) => !open && setSlideToDelete(null)}
          onConfirmDelete={() => handleDeleteSlide(slideToDelete.id)}
        />
      )}
    </div>
  )
}
