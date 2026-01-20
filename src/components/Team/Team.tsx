type TeamProps = {
    creator: string;
    assigned: string[];
}

export default function Team ({ creator, assigned }: TeamProps){
    return (
        <div className="flex gap-1">
            <div className="flex gap-1.5">
                <p className="w-6.75 h-6.75 rounded-full bg-brand-light text-gray-950 body-2xs flex items-center justify-center">
                {creator}
                </p> 
                <p className="rounded-full bg-brand-light text-brand-dark body-s flex items-center justify-center px-4 py-1">
                    Propriétaire
                </p>
            </div>
            <ul className="flex items-center">
            {assigned.map((assignee, index) => (
                <li
                key={assignee}
                className={`w-7 h-7 rounded-full bg-gray-200 border border-white text-gray-950 body-2xs flex items-center justify-center ${index > 0 ? '-ml-2' : ''}`}
                >
                {assignee}
                </li>
            ))}
            </ul>
        </div>
    )
}