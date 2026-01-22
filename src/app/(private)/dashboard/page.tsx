import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/dashboard/Banner"
import Chips from "@/components/Chips/Chips"

export default function DashBoard({}){


  return (
    <div className="flex h-screen">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <Banner
            title="Tableau de bord"
            firstName="Alice"
            lastName="Dupont"
          />

        </main>
        <Footer />
      </div>
    </div>
  )
}