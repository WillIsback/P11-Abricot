// Import global styles and fonts
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "404 - Page Not Found",
	description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
	return (
		<html lang="fr" className={inter.className}>
			<body
				style={{
					margin: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					width: "100%",
					backgroundImage: "url('/images/LogIn.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "2rem",
						backgroundColor: "rgba(255, 255, 255, 0.9)",
						backdropFilter: "blur(4px)",
						borderRadius: "1rem",
						padding: "4rem 3rem",
						boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
						maxWidth: "28rem",
						textAlign: "center",
					}}
				>
					{/* Grande illustration du numéro 404 */}
					<div
						style={{
							fontSize: "6rem",
							fontWeight: "bold",
							background: "linear-gradient(to right, #2563eb, #9333ea)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						404
					</div>

					{/* Titre principal */}
					<div>
						<h1
							style={{
								fontSize: "2.25rem",
								fontWeight: "bold",
								color: "#111827",
								marginBottom: "0.75rem",
							}}
						>
							Oups !
						</h1>
						<p
							style={{
								fontSize: "1.125rem",
								color: "#4b5563",
								marginBottom: "0.5rem",
							}}
						>
							Cette page n&apos;existe pas.
						</p>
						<p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
							Il se peut que la page ait été supprimée ou que vous ayez tapé une
							URL incorrecte.
						</p>
					</div>

					{/* Bouton de retour */}
					<a
						href="/dashboard?chips=task"
						style={{
							marginTop: "1rem",
							padding: "0.75rem 2rem",
							background: "linear-gradient(to right, #2563eb, #9333ea)",
							color: "white",
							fontWeight: "600",
							borderRadius: "0.5rem",
							textDecoration: "none",
							transition: "box-shadow 0.3s",
						}}
					>
						Retourner à l&apos;accueil
					</a>
				</div>
			</body>
		</html>
	);
}
