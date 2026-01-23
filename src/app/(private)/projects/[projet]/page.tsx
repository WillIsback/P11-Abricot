import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/ui/Banner"

interface ProjetPageProps {
  params: Promise<{
    projet: string
  }>
}

export default async function ProjetPage({ params }: ProjetPageProps) {
  const { projet } = await params

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <Banner
            title={`Projet: ${projet}`}
            firstName="Alice"
            lastName="Dupont"
          />
        </main>
        <Footer />
      </div>
    </div>
  )
}
