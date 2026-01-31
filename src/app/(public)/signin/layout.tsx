import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Inscription",
	description:
		"Créez votre compte Abricot et commencez à gérer vos projets collaboratifs.",
};

export default function SigninLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
