import Menu from "@/components/Menu/Menu"
import Footer from "@/components/Footer/Footer"
import { profile } from "@/action/auth.action"
import { isUser } from "@/lib/utils"
import { getInitialsFromName } from "@/lib/client.lib"
import AccountForm from "@/components/ui/AccountForm"
export default async function AccountPage() {
  const profileData = await profile();



  if(!profileData.ok) return <p>Une erreur est apparue : {profileData.message}</p>
  if(!isUser(profileData.data)) return <p>Une erreur est apparue : {profileData.message}</p>
  const userInitial = getInitialsFromName(profileData.data.user.name)
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="m-auto mt-0">
        <Menu userInitial={userInitial}/>
        <main className="">
        <AccountForm userName={profileData.data.user.name}/>
        </main>
        <Footer />
      </div>
    </div>
  )
}