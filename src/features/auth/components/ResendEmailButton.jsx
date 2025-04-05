import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const RESEND_DELAY = 60

const ResendEmailButton = ({ onResend, buttonText }) => {
  const t = useTranslations("ResendEmailButton")
  const [canResend, setCanResend] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)

  const startResendTimer = () => {
    setCanResend(false)
    setTimeLeft(RESEND_DELAY)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setCanResend(true)

          return 0
        }

        return prevTime - 1
      })
    }, 1000)
  }

  useEffect(() => {
    startResendTimer()
  }, [])

  const handleResend = async () => {
    if (!canResend) {
      return
    }

    try {
      await onResend()
      startResendTimer()
    } catch (error) {
      console.error(`An error has occurred: ${error}`)
    }
  }

  return (
    <Button
      onClick={handleResend}
      disabled={!canResend}
      className={"mt-4 w-full"}
    >
      {canResend ? buttonText : t("resendInSeconds", { seconds: timeLeft })}
    </Button>
  )
}

export default ResendEmailButton
