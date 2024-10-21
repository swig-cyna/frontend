import { Button } from "@/components/ui/button"
import Link from "next/link"

const NotFound = () => (
  <main className="text-center mt-16">
    <h1 className="text-8xl font-extrabold text-white">404</h1>
    <h2 className="text-3xl">Not Found</h2>
    <Link href="/">
      <Button className="mt-4">Go Home</Button>
    </Link>
  </main>
)

export default NotFound
