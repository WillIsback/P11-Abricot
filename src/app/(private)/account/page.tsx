import type { Metadata } from "next";
import { profile } from "@/action/auth.action";
import Footer from "@/components/Footer/Footer";
import Menu from "@/components/Menu/Menu";
import AccountForm from "@/components/ui/AccountForm";
import { getInitialsFromName } from "@/lib/client.lib";
import { isUser } from "@/lib/utils";
export const metadata: Metadata = {
	title: "Mon compte",
	description: "Gérez vos informations personnelles et votre mot de passe.",
};

export default async function AccountPage() {
	const profileData = await profile();
	if (!profileData.ok)
		return <p>Une erreur est apparue : {profileData.message}</p>;
	if (!isUser(profileData.data))
		return <p>Une erreur est apparue : {profileData.message}</p>;
	const userInitial = getInitialsFromName(profileData.data.user.name);
	return (
		<div className="flex bg-gray-50">
			<div className="w-360 mt-0 m-auto">
				<Menu userInitial={userInitial} />
				<main
					id="main-content"
					className="m-auto mt-16.75 w-1215/1440 px-14.75 py-10 rounded-[10px] bg-white border border-gray-200"
				>
					<AccountForm userName={profileData.data.user.name} />
				</main>
				<Footer />
			</div>
		</div>
	);
}
