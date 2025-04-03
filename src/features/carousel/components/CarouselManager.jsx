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
import { useToast } from "@/hooks/useToast"
import { DragDropContext } from "@hello-pangea/dnd"
import { useQueryClient } from "@tanstack/react-query"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { useCarousel } from "../hooks/useCarousel"
import { useAddSlide, useReorderSlides } from "../hooks/useSlide"
import { AddSlideDialog } from "./AddSlideDialog"
import { CarouselPreview } from "./CarouselPreview"
import { DeleteSlideDialog } from "./DeleteSlideDialog"
import { EditSlideDialog } from "./EditSlideDialog"
import { SlideList } from "./SideList"

export function CarouselManager() {
  const { toast } = useToast()
  const { data: slides, isLoading } = useCarousel()
  const addSlideMutation = useAddSlide()
  const reorderSlidesMutation = useReorderSlides()
  const queryClient = useQueryClient()

  const [isAddSlideOpen, setIsAddSlideOpen] = useState(false)
  const [slideToEdit, setSlideToEdit] = useState(null)
  const [slideToDelete, setSlideToDelete] = useState(null)
  const [localSlides, setLocalSlides] = useState([])

  const handleAddSlide = (newSlide) => {
    addSlideMutation.mutate(newSlide, {
      onSuccess: () => {
        setIsAddSlideOpen(false)
        toast({
          title: "Slide Added",
          description: "The slide has been successfully added to the carousel.",
        })
      },
    })
  }

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

  if (isLoading) {
    return <div>Loading...</div>
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
            slides={localSlides.length ? localSlides : slides}
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
            <CarouselPreview
              slides={localSlides.length ? localSlides : slides}
            />
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
