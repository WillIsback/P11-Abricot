import { TaskAssignee } from "@/schemas/backend.schemas";
import { getInitialsFromName } from "@/lib/client.lib";
import * as z from "zod";

type Assignee = z.infer<typeof TaskAssignee>;

export default function Assignees ({ assignee }: { assignee?: Assignee[] }) {
    const list = assignee ?? [];
    return (
        <ul className="flex gap-2">
        {list.map((a) => {
            return (
            <div 
                className="flex gap-1 w-fit h-fit items-center justify-center" 
                key={a.id}
            >
                <li className="flex rounded-[50px] bg-gray-200 w-6.75 h-6.75 items-center justify-center">
                <span className="text-gray-950 body-2xs">
                    {getInitialsFromName(a.user.name)}
                    </span>
                </li>
                <li className="rounded-[50px] bg-gray-200 w-fit h-fit text-gray-600 body-s px-4 py-1">
                {a.user.name}
                </li>
            </div>
            )
        })}
        </ul>
    )
}
