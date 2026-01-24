import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import ProjectBanner from "@/components/ui/ProjectBanner";
import { notFound } from 'next/navigation'


export default async function Projet({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if(!slug) return notFound();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <ProjectBanner
            title="Nom du projet"
            description="Développement de la nouvelle version de l'API REST avec authentification JWT"
          />
        </main>
        <Footer />
      </div>
    </div>
  )
}
