import Link from "next/link"
import { LayoutDashboard } from 'lucide-react';
import { FolderOpen } from 'lucide-react';


export default function MenuItems (){
    return (
        <nav>
            <ul className="flex gap-4">
                <li className="">
                    <Link href="#Dashboard" className="flex  flex-row group w-62 rounded-[10px] py-6 gap-4 justify-center items-center bg-white hover:bg-gray-950 focus:bg-gray-950">
                        <LayoutDashboard className="scale-x-[-1] stroke-brand-dark fill-brand-dark group-hover:fill-white group-focus:fill-white group-hover:stroke-none group-focus:stroke-none"/>
                        <span className="body-m text-brand-dark group-hover:text-white group-focus:text-white">Tableau de bord</span>
                    </Link>
                </li>
                <li className="">
                    <Link href="#Projects" className="flex  flex-row group w-62 rounded-[10px] py-6 gap-4 justify-center items-center bg-white hover:bg-gray-950 focus:bg-gray-950">
                        <FolderOpen className="stroke-white fill-brand-dark group-hover:fill-white group-focus:fill-white group-hover:stroke-gray-950 group-focus:stroke-gray-950"/>
                        <span className="body-m text-brand-dark group-hover:text-white group-focus:text-white">Projets</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}