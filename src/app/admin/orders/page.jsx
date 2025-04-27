"use client"

import { OrderTable } from "@/features/orders/components/OrderTable"

const Page = () => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Commandes</h1>
      <OrderTable />
    </div>
  )
}

export default Page
