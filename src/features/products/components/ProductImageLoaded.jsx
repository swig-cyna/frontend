import { Button } from "@/components/ui/button"
import { ImagePlus, Upload, X } from "lucide-react"
import Image from "next/image"
import { Input } from "postcss"

// eslint-disable-next-line arrow-body-style
export const ProductImageLoaded = ({ images, removeImage }) => {
  const handleImageUpload = () => {
    console.log("Uploaded")
  }

  return (
    <>
      {images.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-medium">
              Toutes les images ({images.length})
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-md border"
                >
                  <Image
                    fill
                    src={image || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-center text-xs text-white">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12">
          <ImagePlus className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-center text-muted-foreground">
            Aucune image ajoutée. Ajoutez des images pour créer un carrousel
            pour ce produit.
          </p>
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleImageUpload}
            />
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Sélectionner des images
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
