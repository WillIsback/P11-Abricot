import Gauge from "./Gauge";
import Team from "../Team/Team";
import { ProjectWithTasks } from "@/schemas/backend.schemas";

import * as z from "zod"



export default function CardProject (props: z.infer<typeof ProjectWithTasks>){
    const { name, description, owner, members, tasks } = props;
    const totalTeamMembers = members.length + 1
    const completed = tasks.filter((t)=>t.status==='DONE').length;
    const todo = tasks.filter((t)=>t.status==='TODO').length;
    const progression = Math.round((completed/todo)*100);
    return (
        <div className="
            flex
            flex-col
            w-95
            h-auto
            rounded-xl
            px-8.5
            py-7.5
            gap-14
            border
            border-gray-200
        ">
            <div className="flex flex-col gap-2">
                <h5 className="text-black">{name}</h5>
                <p className="body-s text-gray-600">{description}</p>
            </div>
            <div className="flex flex-col gap-4">
                <p className="flex justify-between body-xs text-gray-600">Progression <span className="text-gray-800 body-xs">{progression}%</span></p>
                <Gauge todo={todo} completed={completed}/>
            </div>
            <div className="flex flex-col gap-3.75">
                <div className="flex items-center gap-2">
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.52637 6.94727C9.78424 6.94727 11.579 8.74215 11.5791 11H3.47363C3.47372 8.74222 5.2686 6.94738 7.52637 6.94727ZM3.87891 5.21094C4.11047 5.73187 4.45811 6.19468 4.86328 6.54199C3.99485 7.06305 3.2998 7.81614 2.89453 8.68457H0C0 6.77405 1.56313 5.21099 3.47363 5.21094H3.87891ZM7.52637 0.579102C9.12507 0.579102 10.4208 1.87494 10.4209 3.47363C10.4209 5.07238 9.12511 6.36816 7.52637 6.36816C5.92769 6.36809 4.63184 5.07233 4.63184 3.47363C4.63189 1.87499 5.92772 0.579177 7.52637 0.579102ZM3.47363 0C3.99467 0 4.45802 0.173434 4.86328 0.462891C3.99488 1.15761 3.47367 2.25787 3.47363 3.47363C3.47363 3.8789 3.53167 4.28446 3.64746 4.63184H3.47363C2.19994 4.63182 1.1582 3.58913 1.1582 2.31543C1.15843 1.04192 2.20008 1.19457e-05 3.47363 0Z" fill="#6B7280"/>

                    </svg>
                    <span className="text-gray-600 body-2xs">Équipe ({totalTeamMembers})</span>
                </div>
                    <Team owner={owner} members={members} variant="Short"/>
            </div>
        </div>
    )
}
