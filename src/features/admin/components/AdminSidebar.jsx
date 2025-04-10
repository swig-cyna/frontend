import {
  Boxes,
  ChevronUp,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  AppWindow,
  Settings,
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
import Image from "next/image"
import Link from "next/link"
import { signOut, useSession } from "@/features/auth/utils/authClient"
import { useRouter } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "#",
    icon: Boxes,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Orders & Subscriptions",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Customer Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Carousel",
    url: "/admin/carousel",
    icon: AppWindow,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
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
                <DropdownMenuItem key="home">
                  <Link href="/">
                    <span>Back to shop</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button
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
                  </button>
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
