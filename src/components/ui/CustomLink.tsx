'use client';

import { usePathname } from 'next/navigation';
import Link from "next/link"
import { Button } from './button';

interface CustomLinkProps {
    label: string,
    type: 'Routeur' | 'Opener',
    href?: string,
    onClickHandler?: ()=> void

}

export default function CustomLink ({ label, href, type, onClickHandler } : CustomLinkProps){
    return (
        <>
            {type==='Routeur'
                ? <CustomLinkRouteur 
                    href={href || ''} 
                    label={label}
                />
                : (!onClickHandler)
                    ?<p>CustomClickHandler undefined</p>
                    :<CustomLinkOpener 
                            label={label}
                            onClickHandler={onClickHandler}
                    />
            }   
        </>

    )
}




const CustomLinkRouteur = ({ href, label }: { href: string; label: string }) =>{
    const pathname = usePathname();
    const isCurrent = pathname === href;
    return (
        <Link
            href={href}
            className="body-s text-brand-dark underline focus:text-gray-950 aria-disabled:text-gray-400 "
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
        onClickHandler

    }: {
        label: string 
        onClickHandler: () => void | undefined
    })  => {

    return (
        <Button
            variant='link'
            className="body-s text-brand-dark underline focus:text-gray-950"
            onClick={onClickHandler}
        >
            {label}
        </Button>
    )
}