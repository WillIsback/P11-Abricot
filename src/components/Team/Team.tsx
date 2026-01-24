import Assignee from "../ui/Assignee";

interface Assignee {
  intial: string;
  firstName: string;
  lastName: string;
}

interface TeamProps  {
    creator: string;
    assignees: Assignee[];
    variant?: 'Default'|'Short';
}



export default function Team ({ creator, assignees, variant='Default' }: TeamProps){
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
            {variant==='Short' 
                ?
                <ul className="flex items-center">
                    {assignees.map((assignee, index) => (
                        <li
                            key={crypto.randomUUID()}
                            className={`w-7 h-7 rounded-full bg-gray-200 border border-white text-gray-950 body-2xs flex items-center justify-center ${index > 0 ? '-ml-2' : ''}`}
                        >
                            {assignee.intial}
                        </li>
                    ))}
                </ul>
                :
                <Assignee assignees={assignees} />
            }
        </div>
    )
}