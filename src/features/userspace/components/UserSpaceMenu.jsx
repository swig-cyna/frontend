"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { signOut } from "@/features/auth/utils/authClient"
import {
  CreditCard,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  TicketCheck,
  User2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

const UserSpaceMenu = ({ user }) => {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()

  const userMenuItems = [
    {
      title: t("UserSpaceMenu.accountManagement"),
      icon: User2,
      url: "/user/account-management",
    },
    {
      title: t("UserSpaceMenu.subscriptionManagement"),
      icon: TicketCheck,
      url: "/user/subscription-management",
    },
    {
      title: t("UserSpaceMenu.orderHistory"),
      icon: Package,
      url: "/user/order-history",
    },
    {
      title: t("UserSpaceMenu.paymentManagement"),
      icon: CreditCard,
      url: "/user/payment-management",
    },
    {
      title: t("UserSpaceMenu.addressBook"),
      icon: MapPin,
      url: "/user/address-book",
    },
    {
      title: t("UserSpaceMenu.support"),
      icon: HelpCircle,
      url: "/user/contact-form",
    },
    { title: t("UserSpaceMenu.logout"), icon: LogOut, url: "/" },
  ]

  const handleItemClick = async (item) => {
    if (item.title === t("UserSpaceMenu.logout")) {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/")
          },
        },
      })
    } else {
      router.push(item.url)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <div className="mb-2 h-16 w-16 overflow-hidden rounded-full">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-300">
              <User2 className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>
        <h2 className="text-lg font-semibold">{user?.name || "User"}</h2>
      </CardHeader>
      <CardContent>
        {userMenuItems.map((item) => (
          <div
            key={item.title}
            onClick={() => handleItemClick(item)}
            className={`flex cursor-pointer items-center rounded-md p-2 hover:bg-gray-800 ${
              pathname === item.url ? "bg-primary text-white" : ""
            }`}
          >
            <item.icon className="mr-2" />
            <span>{item.title}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default UserSpaceMenu
