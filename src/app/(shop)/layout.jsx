import Footer from "@/components/Footer"
import Header from "@/components/Header"

const ShopLayout = ({ children }) => (
  <>
    <Header />
    <div className="flex flex-col justify-items-center h-full flex-1 p-8 max-w-[1200px] w-full font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
    <Footer />
  </>
)

export default ShopLayout
