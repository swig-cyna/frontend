"use client"

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Overview } from "@/features/admin/components/Overview"
import { RecentOrders } from "@/features/admin/components/RecentOrders"
import { RecentTickets } from "@/features/admin/components/RecentTickets"
import { useDashStatistics } from "@/features/admin/hooks/useDashboard"

export default function DashboardPage() {
  const { data: statistics } = useDashStatistics()

  return (
    <div className="flex-1 space-y-4 p-4 md:px-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics ? (
                statistics.users.count.toLocaleString()
              ) : (
                <Skeleton className="mb-2 h-6 w-16" />
              )}
            </div>
            {statistics ? (
              <p className="text-xs text-muted-foreground">
                {statistics.users.growth > 0 ? "+" : ""}
                {statistics.users.growth}% compared to last month
              </p>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics ? (
                statistics.products.count
              ) : (
                <Skeleton className="mb-2 h-6 w-16" />
              )}
            </div>
            {statistics ? (
              <p className="text-xs text-muted-foreground">
                {statistics.products.newProducts > 0 ? "+" : ""}
                {statistics.products.newProducts}% new products this week
              </p>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics ? (
                statistics.orders.count
              ) : (
                <Skeleton className="mb-2 h-6 w-16" />
              )}
            </div>
            {statistics ? (
              <p className="text-xs text-muted-foreground">
                {statistics.orders.growth > 0 ? "+" : ""}
                {statistics.orders.growth}% compared to last week
              </p>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statistics ? (
              <div className="text-2xl font-bold">
                {statistics.revenue.currency}
                {statistics.revenue.amount.toLocaleString()}
              </div>
            ) : (
              <Skeleton className="mb-2 h-6 w-16" />
            )}
            {statistics ? (
              <p className="text-xs text-muted-foreground">
                {statistics.revenue.growth > 0 ? "+" : ""}
                {statistics.revenue.growth}% compared to last month
              </p>
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>General overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-4 flex flex-col lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent tickets</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <RecentTickets />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/support">Show all tickets</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full flex flex-col">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <RecentOrders />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="ml-auto">
              <Link href="/admin/orders">Show all orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
