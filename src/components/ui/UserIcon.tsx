'use client';
import Link from "next/link";
export default function UserIcon ({ user,variant = 'Default', bg = 'bg-brand-light' }: {user : string, variant?: 'Default'|'Comment', bg?: string}){

    return (
        (variant==='Default')
            ?
                <Link
                    type="button"
                    className="group flex rounded-full w-16.25 h-16.25 justify-center items-center bg-brand-light hover:bg-brand-dark focus:bg-brand-dark"
                    href="/account"
                >
                    <span className="caption-l text-gray-950 group-hover:text-white group-focus:text-white">{user}</span>
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