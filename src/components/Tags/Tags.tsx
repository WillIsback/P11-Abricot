type TagColor = 'gray' | 'orange' | 'info' | 'warning' | 'error' | 'success'

interface TagsProps {
    label: string;
    color: TagColor;
}

const colorStyles: Record<TagColor, string> = {
    gray: 'bg-gray-200 text-gray-600',
    orange: 'bg-brand-light text-brand-dark',
    info: 'bg-info-light text-info',
    warning: 'bg-warning-light text-warning',
    error: 'bg-error-light text-error',
    success: 'bg-success-light text-success',
}

export default function Tags({ label, color }: TagsProps){


    return (
        <div className={`
            inline-flex
            items-center
            rounded-full
            justify-center
            body-s
            px-4
            py-1
            ${colorStyles[color]}
        `}>
            {label}
        </div>
    )
}