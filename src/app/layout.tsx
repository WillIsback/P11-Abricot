import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
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
  title: 'Abricot - Gestion de Projet',
  description: 'SaaS de gestion de projet collaboratif boosté à l\'IA',
  icons: {
    icon: '/icon.svg',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      className={`${manrope.variable} ${inter.variable}`}
    >
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
