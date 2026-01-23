'use client';
import Link from "next/link"
import { LayoutDashboard } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import { usePathname } from "next/navigation";


export default function MenuItems (){
    const pathname = usePathname();
    const isDashboard = pathname==="/dashboard";
    const isProjects = pathname==="/projects"
    return (
        <nav>
            <ul className="flex gap-4">
                <li className="">
                    <Link
                        href="/dashboard"
                        className="flex  flex-row group w-62 rounded-[10px] py-6 gap-4 justify-center items-center bg-white aria-disabled:bg-gray-950 "
                        aria-disabled={isDashboard}
                        onClick={(e) => isDashboard && e.preventDefault()}
                    >
                        <LayoutDashboard className="scale-x-[-1] stroke-brand-dark fill-brand-dark group-aria-disabled:fill-white  group-aria-disabled:stroke-none"/>
                        <span className="body-m text-brand-dark group-aria-disabled:text-white ">Tableau de bord</span>
                    </Link>
                </li>
                <li className="">
                    <Link
                        href="/projects"
                        className="flex  flex-row group w-62 rounded-[10px] py-6 gap-4 justify-center items-center bg-white aria-disabled:bg-gray-950 "
                        aria-disabled={isProjects}
                        onClick={(e) => isProjects && e.preventDefault()}
                    >
                        <FolderOpen className="stroke-white fill-brand-dark group-aria-disabled:fill-white  group-aria-disabled:stroke-gray-950"/>
                        <span className="body-m text-brand-dark group-aria-disabled:text-white">Projets</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
