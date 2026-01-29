import Contributors from "./Contributors";
import { getInitialsFromName } from "@/lib/client.lib";
import { User, ProjectMember } from "@/schemas/backend.schemas";

import * as z from "zod";

interface TeamProps{
    owner: z.infer<typeof User>,
    members: z.infer<typeof ProjectMember>[],
    variant: 'Short' | 'Default',
}

export default function Team ({ owner, members, variant='Default' }: TeamProps){
    const contributors = members.filter((m)=>m.role==='CONTRIBUTOR')
    const ownerInitials = getInitialsFromName(owner.name)
    return (
        <div className="flex gap-1">
            <div className="flex gap-1.5">
                <p className="w-6.75 h-6.75 rounded-full bg-brand-light text-gray-950 body-2xs flex items-center justify-center">
                {ownerInitials}
                </p>
                <p className="rounded-full bg-brand-light text-brand-dark body-s flex items-center justify-center px-4 py-1">
                    Propriétaire
                </p>
            </div>
            {variant==='Short'
                ?
                <ul className="flex items-center">
                    {contributors.map((c, index) => (
                        <li
                            key={c.id}
                            className={`w-7 h-7 rounded-full bg-gray-200 border border-white text-gray-950 body-2xs flex items-center justify-center ${index > 0 ? '-ml-2' : ''}`}
                        >
                            {getInitialsFromName(c.user.name)}
                        </li>

                    ))}
                </ul>
                :
                <Contributors members={members}/>
            }
        </div>
    )
}