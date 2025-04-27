import {
  AppWindow,
  BadgePercent,
  Boxes,
  ChevronUp,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Tag,
  User2,
  Users,
} from "lucide-react"

import logo from "@/assets/logoText.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/features/auth/utils/authClient"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Boxes },
  { title: "Subscriptions", url: "/admin/subscriptions", icon: BadgePercent },
  { title: "Categories", url: "/admin/categories", icon: Tag },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Orders & Subscriptions", url: "/admin/orders", icon: CreditCard },
  { title: "Customer Support", url: "/admin/support", icon: LifeBuoy },
  { title: "Carousel", url: "/admin/carousel", icon: AppWindow },
]

const AdminSidebar = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <Sidebar>
      <SidebarContent>
        <div className="mx-3 mt-3 flex items-center justify-between">
          <Image src={logo} className="mt-1 h-8 w-auto" alt="logo" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session?.user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild key="home" className="cursor-pointer">
                  <Link href="/">
                    <span>Back to shop</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/")
                        },
                      },
                    })
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
