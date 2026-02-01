"use client";
import { FolderOpen, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MenuItems() {
	const pathname = usePathname();
	const isDashboard = pathname === "/dashboard";
	const isProjects = pathname.includes("/projects");
	return (
		<nav className="flex w-fit h-fit">
			<ul className="flex gap-4">
				<li className="">
					<Link
						href="/dashboard"
						className="flex flex-row group w-62 rounded-[10px] py-6.75 gap-4 justify-center items-center bg-white aria-[current=page]:bg-gray-950 "
						aria-current={isDashboard ? "page" : undefined}
						onClick={(e) => isDashboard && e.preventDefault()}
					>
						<LayoutDashboard className="scale-x-[-1] stroke-brand-dark fill-brand-dark group-aria-[current=page]:fill-white  group-aria-[current=page]:stroke-none" />
						<span className="body-m text-brand-text group-aria-[current=page]:text-white ">
							Tableau de bord
						</span>
					</Link>
				</li>
				<li className="">
					<Link
						href="/projects"
						className="flex flex-row group w-62 rounded-[10px] py-6.75 gap-4 justify-center items-center bg-white aria-[current=page]:bg-gray-950 "
						aria-current={isProjects ? "page" : undefined}
						onClick={(e) => isProjects && e.preventDefault()}
					>
						<FolderOpen
							size={"23px"}
							className="stroke-white scale-[1.5] fill-brand-dark group-aria-[current=page]:fill-white  group-aria-[current=page]:stroke-gray-950"
						/>
						<span className="body-m text-brand-text group-aria-[current=page]:text-white">
							Projets
						</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
