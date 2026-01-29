import { redirect } from "next/navigation"
import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/ui/Banner"
import DisplayDashboardContent from "@/components/Dashboard/DisplayDashboardContent"
import { profile } from "@/action/auth.action"
import { isUser } from "@/lib/utils"
import { getInitialsFromName } from "@/lib/client.lib"

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
  if(!isUser(profileData.data)) return <p>Une erreur est apparue : {profileData.message}</p>
  const userInitial = getInitialsFromName(profileData.data.user.name)
  if (!chips) {
    redirect("/dashboard?chips=task")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu userInitial={userInitial}/>
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