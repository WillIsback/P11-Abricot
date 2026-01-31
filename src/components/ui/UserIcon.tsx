"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UserIcon({
	user,
	variant = "Default",
	bg = "bg-brand-light",
}: {
	user: string;
	variant?: "Default" | "Comment";
	bg?: string;
}) {
	const pathname = usePathname();
	const isAccountPage = pathname.includes("account");
	return variant === "Default" ? (
		<Link
			className="group flex rounded-full w-16.25 h-16.25 justify-center items-center bg-brand-light hover:bg-brand-dark
									focus:bg-brand-dark aria-[current=page]:bg-[#9a4000]"
			aria-current={isAccountPage ? "page" : undefined}
			aria-label="Mon compte"
			href="/account"
		>
			<span className="caption-l text-gray-950 group-hover:text-white group-focus:text-white group-aria-[current=page]:text-white">
				{user}
			</span>
		</Link>
	) : (
		<button
			type="button"
			className={`group flex rounded-full h-fit w-fit  justify-center items-center ${bg} `}
		>
			<span className="caption-s text-gray-950 mx-2 my-2">{user}</span>
		</button>
	);
}
