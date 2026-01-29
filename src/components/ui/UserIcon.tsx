'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function UserIcon ({ user,variant = 'Default', bg = 'bg-brand-light' }: {user : string, variant?: 'Default'|'Comment', bg?: string}){
    const pathname = usePathname();
    const isAccountPage = pathname.includes('account')
    return (
        (variant==='Default')
            ?
                <Link
                    type="button"
                    className="group flex rounded-full w-16.25 h-16.25 justify-center items-center bg-brand-light hover:bg-brand-dark focus:bg-brand-dark aria-disabled:bg-brand-dark"
                    aria-disabled={isAccountPage}
                    href="/account"
                >
                    <span className="caption-l text-gray-950 group-hover:text-white group-focus:text-white group-aria-disabled:text-white">{user}</span>
                </Link>
            :
                <button
                    type="button"
                    className={`group flex rounded-full h-fit w-fit  justify-center items-center ${bg} `}
                >
                    <span className="caption-s text-gray-950 mx-2 my-2">{user}</span>
                </button>

    )
}