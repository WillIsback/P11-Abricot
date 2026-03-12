import LogoBlack from "@/assets/logo/loge_black.svg";

export default function Footer() {
	return (
		<footer className="flex justify-between px-4 sm:px-7.5 py-4 sm:py-6 bg-white">
			<LogoBlack
				aria-hidden="true"
				className="w-25.25 h-auto"
				viewBox="0 0 253 33"
				width={undefined}
				height={undefined}
			/>
			<p className="body-m text-black">Abricot 2026</p>
		</footer>
	);
}
