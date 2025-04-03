"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import {
  Edit,
  ExternalLink,
  GripVertical,
  ImagePlus,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { getSlideImageUrl } from "../utils/image"

export function SlideList({ slides, onEdit, onDelete, isReordering = false }) {
  return (
    <Droppable droppableId="slides">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-4"
        >
          {slides && slides.length > 0 ? (
            slides.map((slide, index) => (
              <Draggable
                key={slide.id}
                draggableId={String(slide.id)}
                index={index}
              >
                {(provided2, snapshot) => (
                  <Card
                    ref={provided2.innerRef}
                    {...provided2.draggableProps}
                    className={`flex items-center space-x-4 rounded-md border p-4 ${
                      snapshot.isDragging ? "opacity-60" : ""
                    } ${isReordering ? "cursor-wait" : ""}`}
                  >
                    <div
                      {...provided2.dragHandleProps}
                      className="flex h-full cursor-grab items-center px-1"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md">
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
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{slide.title}</h4>
                        {slide.link && (
                          <a
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center text-xs text-blue-500 hover:underline"
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Link
                          </a>
                        )}
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {slide.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>Position: {index + 1}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(slide)}
                        disabled={isReordering}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(slide)}
                        disabled={isReordering}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </Card>
                )}
              </Draggable>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                No slides configured. Add your first slide to get started.
              </p>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
