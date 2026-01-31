import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Connexion",
	description:
		"Connectez-vous à votre espace Abricot pour gérer vos projets collaboratifs.",
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
