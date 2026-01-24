import { Sparkles } from 'lucide-react';

export default function IAButtonSquare ({}){
    return (
        <button className="
        group
        flex
        items-center
        justify-center
        h-12.5
        w-23.5
        rounded-[10px]
        bg-brand-dark
        focus:bg-brand-light
        gap-2.5
        px-6
        py-3.25
        ">
            <Sparkles width={21} height={21} fill="white" stroke='none' className="group-hover:fill-brand-dark group-hover:stroke-0 group-focus:fill-brand-dark group-focus:stroke-0"/>
            <label className='body-m text-white group-focus:text-brand-dark group-hover:text-brand-dark'>IA</label>
        </button>
    )
}