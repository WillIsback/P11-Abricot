import { redirect } from "next/navigation"
import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/ui/Banner"
import DisplayDashboardContent from "@/components/Dashboard/DisplayDashboardContent"
import { profile } from "@/action/auth.action"


type DashboardPageProps = {
  searchParams: Promise<{
    chips?: string
  }>
}

export default async function DashBoard({ searchParams }: DashboardPageProps){
  const params = await searchParams
  const chips = params?.chips

  const profileData = await profile();
 
  if(!profileData.ok) return <p>Une erreur est apparue : {profileData.message}</p>
  if(profileData.data?.user === undefined) return <p>Une erreur est apparue : {profileData.message}</p>

  if (!chips) {
    redirect("/dashboard?chips=task")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu />
        <main className="px-25 py-22.25">
          <Banner
            title="Tableau de bord"
            name={profileData.data?.user.name}
          />
          <DisplayDashboardContent />
        </main>
        <Footer />
      </div>
    </div>
  )
}