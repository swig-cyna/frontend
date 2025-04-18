import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { useUploadImageProduct } from "../hook/useProducts"
import { getProductImageUrl } from "../utils/image"

export const ProductImageLoaded = ({ images, onUploaded, removeImage }) => {
  const { mutateAsync: uploadImage } = useUploadImageProduct()

  const handleFileChange = async (event) => {
    const [file] = event.target.files

    if (file) {
      const image = await uploadImage(file)
      onUploaded(image.imageId)
    }
  }

  return (
    <>
      {images.length > 0 ? (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="mb-2 text-sm font-medium">
                All Images ({images.length})
              </h4>
              {images.length > 0 && (
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={handleFileChange}
                  />
                  <Button>
                    <Plus className="mr-1 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-md border"
                >
                  <Image
                    fill
                    src={getProductImageUrl(image)}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
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
            No images added. Add images to create a carousel for this product.
          </p>
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <Button>
              <Upload className="mr-1 h-4 w-4" />
              Select Image
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
