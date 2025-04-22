import cyberNet from "@/assets/cyber.png"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

const About = () => {
  const t = useTranslations("AboutUs")

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 md:flex-row">
      <div className="flex-1">
        <h2 className="mb-4 text-5xl font-bold">{t("title")}</h2>
        <Card className="w-full p-5">
          <div className="pt-4">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-3 text-lg font-medium">{t("subTitle")}</h3>
                <p className="mb-4 leading-relaxed text-card-foreground">
                  {t("desc1")}
                </p>
                <p className="mb-6 leading-relaxed text-card-foreground">
                  {t("desc2")}
                </p>
                <div className="w-auto rounded border-l-4 border-primary bg-accent p-4">
                  <p className="font-medium text-accent-foreground">
                    {t("phrase")}
                  </p>
                </div>
                <Link href="https://cyna-it.fr/" target="_blank">
                  <Button
                    size="lg"
                    className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t("learnMore")} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Image height={400} width={400} src={cyberNet} alt="about" />
      </div>
    </div>
  )
}

export default About
