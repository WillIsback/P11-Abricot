'use client';

import { usePathname } from 'next/navigation';
import Link from "next/link"

export default function CustomLink ({ label, link } : {label : string, link: string}){
    const pathname = usePathname();
    const isCurrent = pathname === link;

    return (
        <Link
            href={link}
            className="body-s text-brand-dark underline focus:text-gray-950 aria-disabled:text-gray-400 "
            aria-disabled={isCurrent}
            onClick={(e) => isCurrent && e.preventDefault()}
        >
            {label}
        </Link>
    )
}
