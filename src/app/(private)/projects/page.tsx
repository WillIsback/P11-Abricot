import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import Banner from "@/components/ui/Banner"
import DisplayProjects from "@/components/Projects/DisplayProjects"
import { profile } from "@/action/auth.action"
import { isUser } from "@/lib/utils"
import { getInitialsFromName } from "@/lib/client.lib"

export default async function Projects({}){
  const profileData = await profile();
  if(!profileData.ok) return <p>Une erreur est apparue : {profileData.message}</p>
  if(!isUser(profileData.data)) return <p>Une erreur est apparue : {profileData.message}</p>
  const userInitial = getInitialsFromName(profileData.data.user.name)
  return (
    <div className="flex bg-gray-50">
      <div className="w-360 m-auto mt-0">
        <Menu userInitial={userInitial}/>
        <main className="px-25 py-22.25">
          <Banner
            title="Mes projets"
            name=""
          />
          <DisplayProjects />
        </main>
        <Footer />
      </div>
    </div>
  )
}