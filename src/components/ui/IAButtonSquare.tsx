import { Sparkles } from 'lucide-react';


export default function IAButtonSquare ({onClick}:{onClick: ()=> void}){
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
            hover:shadow-md
            cursor-pointer
            "
            onClick={onClick}
        >
            <Sparkles width={21} height={21} fill="white" stroke='none'/>
            <label className='body-m text-white'>IA</label>
        </button>
    )
}