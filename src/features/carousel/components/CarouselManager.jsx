"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { DragDropContext } from "@hello-pangea/dnd"
import { useQueryClient } from "@tanstack/react-query"
import { LucideLoader2, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useCarousel } from "../hooks/useCarousel"
import { useReorderSlides } from "../hooks/useSlide"
import { AddSlideDialog } from "./AddSlideDialog"
import { CarouselPreview } from "./CarouselPreview"
import { DeleteSlideDialog } from "./DeleteSlideDialog"
import { EditSlideDialog } from "./EditSlideDialog"
import { SlideList } from "./SideList"

export function CarouselManager() {
  const { data: slides, isLoading } = useCarousel()
  const reorderSlidesMutation = useReorderSlides()
  const queryClient = useQueryClient()

  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false)
  const [slideToEdit, setSlideToEdit] = useState(null)
  const [slideToDelete, setSlideToDelete] = useState(null)
  const [localSlides, setLocalSlides] = useState([])

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const updatedSlides = [...(localSlides.length ? localSlides : slides)]
    const [reorderedItem] = updatedSlides.splice(result.source.index, 1)
    updatedSlides.splice(result.destination.index, 0, reorderedItem)

    const optimisticSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      order: index,
    }))
    setLocalSlides(optimisticSlides)

    reorderSlidesMutation.mutate(
      { slideId: reorderedItem.id, position: result.destination.index },
      {
        onMutate: async () => {
          await queryClient.cancelQueries(["carousel"])
          const previousSlides = queryClient.getQueryData(["carousel"])
          queryClient.setQueryData(["carousel"], optimisticSlides)

          return { previousSlides }
        },
        onError: (err, variables, context) => {
          queryClient.setQueryData(["carousel"], context.previousSlides)
          setLocalSlides(context.previousSlides)
        },
      },
    )
  }

  useEffect(() => {
    if (slides) {
      setLocalSlides(slides)
    }
  }, [slides])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
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
            slides={localSlides}
            onEdit={setSlideToEdit}
            onDelete={setSlideToDelete}
          />
        </DragDropContext>
      </TabsContent>

      <TabsContent value="preview">
        <Card className="mx-auto max-w-5xl">
          <CardHeader>
            <CardTitle>Carousel Preview</CardTitle>
            <CardDescription>
              Preview of the carousel display in homepage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarouselPreview slides={localSlides} />
          </CardContent>
        </Card>
      </TabsContent>

      <AddSlideDialog
        open={isAddSlideOpen}
        onOpenChange={setIsAddSlideOpen}
        onAddSlide={(open) => !open && setIsAddSlideOpen(null)}
      />

      {slideToEdit && (
        <EditSlideDialog
          slide={slideToEdit}
          open={Boolean(slideToEdit)}
          onOpenChange={(open) => !open && setSlideToEdit(null)}
        />
      )}

      {slideToDelete && (
        <DeleteSlideDialog
          slide={slideToDelete}
          open={Boolean(slideToDelete)}
          onOpenChange={(open) => !open && setSlideToDelete(null)}
        />
      )}
    </div>
  )
}
