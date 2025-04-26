"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSession } from "@/features/auth/utils/authClient"
import { useOrder } from "@/features/stripe/hooks/useOrder"
import { formatDistance } from "date-fns"
import { enUS, fr, he } from "date-fns/locale"
import { Calendar, ShoppingBag } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const OrderHistory = () => {
  const { data: session } = useSession()
  const { data: orderData, isLoading } = useOrder(session?.user.id)
  const [orders, setOrders] = useState([])
  const locale = useLocale()
  const t = useTranslations("OrderHistory")

  const dateLocaleMap = {
    en: enUS,
    fr,
    he,
  }

  const dateLocale = dateLocaleMap[locale] || enUS

  useEffect(() => {
    if (orderData && Array.isArray(orderData)) {
      setOrders(orderData)
    }
  }, [orderData])

  const formatPrice = (price) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: locale === "he" ? "ILS" : "EUR",
    }).format(price)

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    return {
      formatted: new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date),
      relative: formatDistance(date, new Date(), {
        addSuffix: true,
        locale: dateLocale,
      }),
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-8 py-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>

        {[1, 2].map((index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-4 w-36" />
                </div>
                <Skeleton className="h-7 w-24" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="mb-4 h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold">{t("noOrdersFound")}</h2>
        <p className="mt-2 text-gray-500">{t("noOrdersDescription")}</p>
      </div>
    )
  }

  return (
    <div
      className="container mx-auto space-y-8 py-6"
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Badge variant="outline" className="text-sm">
          {orders.length}{" "}
          {orders.length > 1 ? t("ordersPlural") : t("orderSingular")}
        </Badge>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t("orderNumber", { id: order.id })}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(order.createdAt).formatted}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatDate(order.createdAt).relative})
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="items">
                  <AccordionTrigger className="text-base font-medium">
                    {t("orderDetails")}
                    <Badge variant="secondary" className="ml-2">
                      {order.orderItem.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}{" "}
                      {t("items")}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("product")}</TableHead>
                          <TableHead className="text-right">
                            {t("unitPrice")}
                          </TableHead>
                          <TableHead className="text-right">
                            {t("quantity")}
                          </TableHead>
                          <TableHead className="text-right">
                            {t("total")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.orderItem.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.product.name}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPrice(item.product.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-right font-bold"
                          >
                            {t("total")}
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {formatPrice(order.amount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
