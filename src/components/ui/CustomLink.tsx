'use client';

import { usePathname } from 'next/navigation';
import Link from "next/link"
import { Button } from './button';

interface CustomLinkProps {
    label: string,
    type: 'Routeur' | 'Opener',
    href?: string,
    onClickHandler?: ()=> void,
    className?: string,

}

export default function CustomLink ({ label, href, type, onClickHandler, className } : CustomLinkProps){
    return (
        <>
            {type==='Routeur'
                ? <CustomLinkRouteur
                    href={href || ''}
                    label={label}
                    className={className}
                />
                : (!onClickHandler)
                    ?<p>CustomClickHandler undefined</p>
                    :<CustomLinkOpener
                            label={label}
                            onClickHandler={onClickHandler}
                            className={className}
                    />
            }
        </>

    )
}




const CustomLinkRouteur = ({ href, label, className }: { href: string; label: string, className?: string }) =>{
    const pathname = usePathname();
    const isCurrent = pathname === href;
    return (
        <Link
            href={href}
            className={`body-s text-brand-dark underline focus:text-gray-950 aria-disabled:text-gray-400 ${className}`}
            aria-disabled={isCurrent}
            onClick={(e) => isCurrent && e.preventDefault()}
        >
            {label}
        </Link>
    )

}

const CustomLinkOpener = (
    {
        label,
        onClickHandler,
        className

    }: {
        label: string
        onClickHandler: () => void | undefined
        className?: string
    })  => {

    return (
        <Button
            variant='link'
            className={`body-s text-brand-dark underline focus:text-gray-950 ${className}`}
            onClick={onClickHandler}
        >
            {label}
        </Button>
    )
}