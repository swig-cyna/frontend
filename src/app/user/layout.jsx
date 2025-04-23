"use client"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Card, CardHeader } from "@/components/ui/card"
import { useSession } from "@/features/auth/utils/authClient"
import UserSpaceMenu from "@/features/userspace/components/UserSpaceMenu"

const UserLayout = ({ children }) => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header className="flex-shrink-0" />
        <main className="flex flex-grow items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">Loading...</CardHeader>
          </Card>
        </main>
        <Footer className="flex-shrink-0" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col p-8">
        <div className="flex flex-1 flex-col gap-8 md:flex-row">
          <aside className="md:max-w-1/3 w-full md:basis-1/3">
            <UserSpaceMenu user={session.user} />
          </aside>
          <main className="flex w-full flex-1 flex-col items-center justify-center">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UserLayout
