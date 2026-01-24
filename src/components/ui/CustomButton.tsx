'use client';
import { LoaderCircle } from 'lucide-react';

export default function CustomButton ({
    label,
    pending,
    disabled,
    buttonType
} : {
    label: string,
    pending: boolean,
    disabled: boolean,
    buttonType: "submit" | "reset" | "button" | undefined
}) {

    return (
            <button
            type={buttonType}
            className={`
                flex
                justify-center
                items-center
                h-12.5
                w-full
                py-3.25
                px-4
                rounded-[10px]
                ${pending
                    ? 'bg-white text-brand-dark border border-brand-dark'
                    : 'bg-gray-800 text-white focus:bg-gray-950 disabled:bg-gray-200 disabled:text-gray-400'}
            `}
            disabled={disabled}
            >
            <span className='body-m'>{label}</span>
            </button>
    )
}

