import type { Metadata } from "next";
import { profile } from "@/action/auth.action";
import Footer from "@/components/Footer/Footer";
import Menu from "@/components/Menu/Menu";
import DisplayProjects from "@/components/Projects/DisplayProjects";
import Banner from "@/components/ui/Banner";
import { getInitialsFromName } from "@/lib/client.lib";
import { isUser } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Mes projets",
	description: "Gérez et suivez l'ensemble de vos projets collaboratifs.",
};

export default async function Projects() {
	const profileData = await profile();
	if (!profileData.ok)
		return <p>Une erreur est apparue : {profileData.message}</p>;
	if (!isUser(profileData.data))
		return <p>Une erreur est apparue : {profileData.message}</p>;
	const userInitial = getInitialsFromName(profileData.data.user.name);
	return (
		<div className="flex bg-gray-50">
			<div className="w-360 m-auto mt-0">
				<Menu userInitial={userInitial} />
				<main id="main-content" className="w-1166/1440 m-auto py-22.25">
					<Banner title="Mes projets" name="" />
					<DisplayProjects />
				</main>
				<Footer />
			</div>
		</div>
	);
}
