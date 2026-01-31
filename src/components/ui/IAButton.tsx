import { Sparkles } from "lucide-react";

export default function IAButton() {
	return (
		<button
			type="submit"
			aria-label="Générer avec l'IA"
			className="
            group
            flex
            items-center
            justify-center
            h-10
            w-10
            relative
            drop-shadow-md
            rounded-full
            bg-brand-dark
            hover:bg-brand-light
            focus:bg-brand-light
        "
		>
			<Sparkles
				size={14}
				fill="white"
				className="stroke-0 group-hover:fill-brand-dark group-hover:stroke-0 group-focus:fill-brand-dark group-focus:stroke-0"
			/>
		</button>
	);
}
