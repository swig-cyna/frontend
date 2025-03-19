import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"

const NotFound = () => {
  const t = useTranslations("NotFoundPage")

  return (
    <main className="text-center flex-1 flex flex-col justify-center">
      <h1 className="text-8xl font-extrabold text-white">404</h1>
      <h2 className="text-3xl">{t("title")}</h2>
      <Link href="/">
        <Button className="mt-4">{t("backHome")}</Button>
      </Link>
    </main>
  )
}

export default NotFound
