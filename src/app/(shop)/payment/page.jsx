"use client"

import { useSession } from "@/features/auth/utils/authClient"
import { LucideLoader2 } from "lucide-react"

import PaymentForm from "@/features/stripe/components/PaymentForm"

const Subscriptions = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center">
        <LucideLoader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center">
      <PaymentForm userId={session.user.id} />
    </main>
  )
}

export default Subscriptions
