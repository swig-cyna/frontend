import { Card } from "@/components/ui/card"
import Image from "next/image"

const RecapRowProduct = ({ data }) => (
  <Card className="mb-4 overflow-hidden border-l-4 border-l-primary">
    <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-4">
      <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
        <Image
          className="h-full w-full object-cover"
          src="https://picsum.photos/500/500"
          alt={data.name}
          width={80}
          height={80}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">{data.name}</h3>
        <span className="text-sm text-gray-500">Qté: {data.quantity}</span>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-xl font-bold">€{data.price * data.quantity}</p>
        {data.quantity > 1 && (
          <span className="text-xs text-gray-500">
            (€{data.price} par unité)
          </span>
        )}
      </div>
    </div>
  </Card>
)

export default RecapRowProduct
