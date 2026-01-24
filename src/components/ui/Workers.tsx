import Team from "../Team/Team"

type TeamProps = React.ComponentProps<typeof Team>

interface WorkerProps {
    contributors: number,
    teamProps: TeamProps
}

export default function Workers ( props: WorkerProps){
    return (
        <div className="flex h-fit gap-6 px-12.5 py-5 bg-gray-100 rounded-[10px] mt-12.25">
            <div className="flex justify-between items-center w-full">
                <div className="flex w-47.5 h-auto gap-2">
                    <h5 className="text-gray-800">Contributeurs</h5>
                    <span className="text-gray-600 body-m whitespace-nowrap">{props.contributors} personnes</span>
                </div>
                <div className="flex w-fit h-fit gap-2">
                    <Team creator={props.teamProps.creator} assignees={props.teamProps.assignees} variant="Default"/>
                </div>
            </div>

        </div>
    )
}