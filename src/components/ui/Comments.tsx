import type * as z from "zod";
import { Comment as CommentSchema } from "@/schemas/backend.schemas";
import { getInitialsFromName, isUserOwner } from "@/lib/client.lib";
import CustomButton from "./CustomButton";
import UserIcon from "./UserIcon";

type Comment = z.infer<typeof CommentSchema>;

export default function Comments({
	comments,
	projectOwner,
}: {
	comments?: Comment[];
	projectOwner: string;
}) {

	comments?.map((c) => c.author);
	return (
		<div className="flex flex-col gap-4">
			<ul className="flex flex-col gap-4">
				{comments?.map((c) => {
					return (
						<li className="min-w-190 flex gap-3.5" key={c.id}>
							<UserIcon
								user={getInitialsFromName(c.author.name)}
								variant="Comment"
								bg={
									isUserOwner(c.authorId, projectOwner)
										? "bg-brand-light"
										: "bg-gray-200"
								}
							/>
							<div className="flex flex-col px-3.5 py-4.5 bg-gray-100 gap-4.5 rounded-[10px] flex-1">
								<div className="flex flex-row justify-between items-center">
									<p className="body-s text-black">{c.author.name}</p>
									<p className="body-2xs text-gray-600">{c.createdAt}</p>
								</div>
								<p className="body-2xs text-black">{c.content}</p>
							</div>
						</li>
					);
				})}
			</ul>
			<div className="min-w-190 flex gap-3.5">
				<UserIcon user="AD" variant="Comment" />
				<form aria-label="Formulaire d'ajout de commentaire" className="flex flex-col gap-2 flex-1">
					<input
						id="commentID"
						type="text"
						name="comment"
						aria-label="Ajouter un commentaire"
						placeholder="Ajouter un commentaire..."
						className="flex px-3.5 py-4.5 bg-gray-50 text-black body-2xs min-w-140 rounded-[10px]"
					/>
					<div className="flex w-fit place-self-end">
						<CustomButton 
							label="Envoyer"
							pending={false}
							disabled={false}
							buttonType="submit"
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
