"use client"

import React from "react"
import { useSession } from "@/features/auth/utils/authClient"
import { LucideLoader2 } from "lucide-react"

import SubscriptionForm from "@/features/stripe/components/SubscriptionForm"

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
    <main className="flex flex-1 flex-col items-center justify-center">
      <SubscriptionForm userId={session.user.id} />
    </main>
  )
}

export default Subscriptions
