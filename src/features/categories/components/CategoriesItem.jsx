import Image from "next/image"
import Link from "next/link"

const CategoriesItem = () => (
  <div className="relative aspect-square h-40 overflow-hidden rounded-md bg-card">
    <Link
      href={`/categories`}
      className="group relative h-full w-full overflow-hidden rounded-lg"
    >
      <div className="relative aspect-square">
        <Image
          src={"/placeholder.svg"}
          alt="category"
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold">"Category"</h3>
          <p className="text-sm text-white/80">XXX produits</p>
        </div>
      </div>
    </Link>
  </div>
)

export default CategoriesItem
