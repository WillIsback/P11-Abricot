import { Sparkles } from "lucide-react";

export default function IAButtonSquare({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			aria-label="Créer une tâche avec l'IA"
			className="
            group
            flex
            items-center
            justify-center
            h-12.5
            w-23.5
            rounded-[10px]
            bg-brand-text
            focus:bg-brand-light
            gap-2.5
            px-6
            py-3.25
            hover:shadow-md
            cursor-pointer
            "
			onClick={onClick}
		>
			<Sparkles
				width={21}
				height={21}
				className="fill-white group-focus:fill-brand-text"
				stroke="none"
			/>
			<span className="body-m text-white group-focus:text-brand-text">IA</span>
		</button>
	);
}
