"use client"

import { DashboardHeader } from "@/features/admin/components/DashboardHeader"
import { OrderTable } from "@/features/orders/components/OrderTable"

const Page = () => (
  <>
    <DashboardHeader heading="Orders Management" text="Watch and edit orders" />
    <div className="p-6">
      <OrderTable />
    </div>
  </>
)

export default Page
