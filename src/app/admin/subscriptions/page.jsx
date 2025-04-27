"use client"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { SubscriptionList } from "@/features/subscriptions/components/SubscriptionsList"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function Subscriptions() {
  return (
    <>
      <DashboardHeader
        heading="Subscriptions Management"
        text="Manage your subscriptions here and add new ones."
      >
        <Link href="/admin/subscriptions/new">
          <Button>
            <PlusCircle className="mr-1 h-4 w-4" />
            Add subscription
          </Button>
        </Link>
      </DashboardHeader>
      <div className="p-6">
        <SubscriptionList />
      </div>
    </>
  )
}
