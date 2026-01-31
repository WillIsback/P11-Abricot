"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";

interface CustomLinkProps {
	label: string;
	type: "Routeur" | "Opener";
	href?: string;
	onClickHandler?: () => void;
	className?: string;
}

export default function CustomLink({
	label,
	href,
	type,
	onClickHandler,
	className,
}: CustomLinkProps) {
	return (
		<>
			{type === "Routeur" ? (
				<CustomLinkRouteur
					href={href || ""}
					label={label}
					className={className}
				/>
			) : !onClickHandler ? (
				<p>CustomClickHandler undefined</p>
			) : (
				<CustomLinkOpener
					label={label}
					onClickHandler={onClickHandler}
					className={className}
				/>
			)}
		</>
	);
}

const CustomLinkRouteur = ({
	href,
	label,
	className,
}: {
	href: string;
	label: string;
	className?: string;
}) => {
	const pathname = usePathname();
	const isCurrent = pathname === href;
	return (
		<Link
			href={href}
			className={`body-s text-brand-text underline focus:text-gray-950 aria-[current=page]:text-gray-400 ${className}`}
			aria-current={isCurrent ? "page" : undefined}
			onClick={(e) => isCurrent && e.preventDefault()}
		>
			{label}
		</Link>
	);
};

const CustomLinkOpener = ({
	label,
	onClickHandler,
	className,
}: {
	label: string;
	onClickHandler: () => undefined | undefined;
	className?: string;
}) => {
	return (
		<Button
			variant="link"
			className={`body-s text-brand-text underline focus:text-gray-950 ${className}`}
			onClick={onClickHandler}
		>
			{label}
		</Button>
	);
};
