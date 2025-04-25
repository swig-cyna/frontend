import Footer from "@/components/Footer"
import Header from "@/components/Header"

const SubscriptionLayout = ({ children }) => (
  <>
    <Header />
    <div className="flex h-full w-full max-w-[1200px] flex-1 flex-col justify-items-center p-8 font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
    <Footer />
  </>
)

export default SubscriptionLayout
