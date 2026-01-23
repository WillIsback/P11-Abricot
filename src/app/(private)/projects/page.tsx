import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/ui/Banner"

export default function Projects({}){

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <Banner
            title="Mes projets"
            firstName="Alice"
            lastName="Dupont"
          />
          {/* <DisplayProjectContent /> */ }
        </main>
        <Footer />
      </div>
    </div>
  )
}