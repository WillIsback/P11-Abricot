type TagColor = "gray" | "orange" | "info" | "warning" | "error" | "success";

interface TagsProps {
	label: string;
	color: TagColor;
}

const colorStyles: Record<TagColor, string> = {
	gray: "bg-gray-200 text-gray-600",
	orange: "bg-brand-light text-brand-text",
	info: "bg-info-light text-info-text",
	warning: "bg-warning-light text-warning-text",
	error: "bg-error-light text-error-text",
	success: "bg-success-light text-success-text",
};

export default function Tags({ label, color }: TagsProps) {
	return (
		<div
			className={`
            inline-flex
            items-center
            rounded-full
            justify-center
            body-s
            px-4
            py-1
            w-fit
            h-fit
            whitespace-nowrap
            ${colorStyles[color]}
        `}
		>
			{label}
		</div>
	);
}
