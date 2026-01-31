import type * as z from "zod";
import { getInitialsFromName } from "@/lib/client.lib";
import type { ProjectMember } from "@/schemas/backend.schemas";

type Member = z.infer<typeof ProjectMember>;

export default function Contributors({ members }: { members?: Member[] }) {
	const list = members ?? [];
	return (
		<ul className="flex gap-2">
			{list.map((c) => (
				<div
					className="flex gap-1 w-fit h-fit items-center justify-center"
					key={c.id}
				>
					<li className="flex rounded-[50px] bg-gray-200 w-6.75 h-6.75 items-center justify-center">
						<span className="text-gray-950 body-2xs">
							{getInitialsFromName(c.user.name)}
						</span>
					</li>
					<li className="rounded-[50px] bg-gray-200 w-fit h-fit text-gray-600 body-s px-4 py-1">
						{c.user.name}
					</li>
				</div>
			))}
		</ul>
	);
}
