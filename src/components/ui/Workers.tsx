import Team from "./Team";

export default function Workers({
	owner,
	members,
	variant = "Default",
}: React.ComponentProps<typeof Team>) {
	const totalTeamMembers = members.length + 1;
	return (
		<div className="flex w-full h-fit gap-6 px-12.5 py-5 bg-gray-100 rounded-[10px]">
			<div className="flex justify-between items-center w-full">
				<div className="flex w-47.5 h-auto gap-2">
					<h2 className="text-gray-800">Contributeurs</h2>
					<span className="text-gray-600 body-m whitespace-nowrap">
						{totalTeamMembers} personnes
					</span>
				</div>
				<div className="flex w-fit h-fit gap-2">
					<Team owner={owner} members={members} variant={variant} />
				</div>
			</div>
		</div>
	);
}
