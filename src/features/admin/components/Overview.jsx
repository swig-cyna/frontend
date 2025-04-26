"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useSalesOverview } from "../hooks/useDashboard"

export function Overview() {
  const { data: salesOverview, isLoading } = useSalesOverview()

  if (isLoading) {
    return (
      <div className="flex w-full items-end gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className="flex-1"
            style={{ height: `${(index + 1) * 30}px` }}
          />
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesOverview}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
