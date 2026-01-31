"use client";
// import { LoaderCircle } from 'lucide-react';

export default function CustomButton({
	label,
	pending,
	disabled,
	buttonType,
	onClick,
	ref,
	className,
}: {
	label: string;
	pending: boolean;
	disabled: boolean;
	buttonType: "submit" | "reset" | "button" | undefined;
	onClick?: () => void;
	ref?: React.Ref<HTMLButtonElement>;
	className?: string;
}) {
	return (
		<button
			type={buttonType}
			onClick={onClick}
			className={`
                    ${className}
                    flex
                    justify-center
                    items-center
                    h-12.5
                    w-full
                    py-3.25
                    gap-2.5
                    px-18.5
                    rounded-[10px]
										cursor-pointer
                    ${
											pending
												? "bg-white text-brand-text border border-brand-dark"
												: "bg-gray-800 text-white focus:bg-gray-950 disabled:bg-gray-200 disabled:text-gray-400"
										}
                `}
			disabled={disabled}
			ref={ref}
		>
			<span className="body-m">{label}</span>
		</button>
	);
}
