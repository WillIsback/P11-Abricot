import { MoveLeft } from 'lucide-react';
import { Ellipsis } from 'lucide-react';

type buttonType = 'MoveLeft' | 'Ellipsis';

interface IconButtonType {
    button: buttonType;
}
export default function IconButton ({ button }  : IconButtonType){
    return (
        <button type="button" className=" w-14.25 h-14.25 rounded-[10px] group flex items-center justify-center border border-gray-200 bg-white hover:border-brand-dark focus:border-brand-dark">
            { button === 'MoveLeft'
                ? <MoveLeft className="w-3.75 stroke-black group-hover:stroke-brand-dark group-focus:stroke-brand-dark"/>
                : <Ellipsis className="w-3.75 stroke-gray-600 group-hover:stroke-brand-dark group-focus:stroke-brand-dark"/>
            }
        </button>
    )
}