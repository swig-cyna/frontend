import { Card } from "@/components/ui/card"
import Image from "next/image"

const CategoriesItem = () => (
  <Card className="px-4 py-2 flex flex-col items-center justify-center relative overflow-hidden">
    <Image
      src="https://picsum.photos/700/500"
      alt="logo"
      fill
      className="absolute h-full w-full object-cover opacity-50 select-none blur-[1px]"
    />
    <div className="z-10">Category</div>
  </Card>
)

export default CategoriesItem
