import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Abricot - Gestion de Projet",
		template: "%s | Abricot",
	},
	description: "SaaS de gestion de projet collaboratif boosté à l'IA",
	icons: {
		icon: "/icon.svg",
	},
	openGraph: {
		type: "website",
		locale: "fr_FR",
		siteName: "Abricot",
		title: "Abricot - Gestion de Projet",
		description: "SaaS de gestion de projet collaboratif boosté à l'IA",
	},
	twitter: {
		card: "summary_large_image",
		title: "Abricot - Gestion de Projet",
		description: "SaaS de gestion de projet collaboratif boosté à l'IA",
	},
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" className={`${manrope.variable} ${inter.variable}`}>
			<body className={`antialiased`}>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-brand-text focus:underline"
				>
					Aller au contenu principal
				</a>
				<div
					className="mx-auto w-full md:max-w-240
           lg:max-w-300 xl:max-w-360 h-fit"
				>
					{children}
				</div>
			</body>
		</html>
	);
}
