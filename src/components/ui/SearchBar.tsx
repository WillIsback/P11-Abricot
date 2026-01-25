'use client';

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useState } from "react";


import { Search } from 'lucide-react';


export default function SearchBar ({}){
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentSearch, setCurrentSearch] = useState('');

    const createQueryString = useCallback(
        (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)

        return params.toString()
        },
        [searchParams]
    )

    return (
        <div className="flex w-89.25 px-8 justify-between items-center bg-white border border-gray-200 rounded-xl">
            <input
                id='searchBar'
                type="text"
                placeholder="Rechercher une tâche"
                className="body-s text-gray-600 w-auto focus:outline-0"
                value={currentSearch}
                onChange={e => setCurrentSearch(e.target.value)}
            />
            <button
                onClick={() => {
                    router.push(pathname + '?' + createQueryString('search', `${currentSearch}`))
                }}
            >
                <Search stroke='#6B7280' size={14}/>
            </button>
        </div>
    )
}
