interface Assignee {
  intial: string;
  firstName: string;
  lastName: string;
}

interface AssigneesProps {
  assignees : Assignee[];
}

export default function Assignee ({assignees} : AssigneesProps) {
  return (
    <ul className="flex gap-2">
      {assignees.map((assignee) => {
        return (
          <div className="flex gap-1 w-fit h-fit items-center justify-center" key={crypto.randomUUID()}>
            <li className="flex rounded-[50px] bg-gray-200 w-6.75 h-6.75 items-center justify-center"><span className="text-gray-950 body-2xs">{assignee.intial}</span></li>
            <li className="rounded-[50px] bg-gray-200 w-fit h-fit text-gray-600 body-s px-4 py-1">{assignee.firstName} {assignee.lastName}</li>
          </div>
        )
      })}
    </ul>
  )
}
