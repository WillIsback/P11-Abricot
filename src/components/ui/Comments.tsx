"use client";

import { PencilLine, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import type * as z from "zod";
import {
	createComment,
	deleteComment,
	updateComment,
} from "@/action/comment.action";
import {
	canEditComment,
	getInitialsFromName,
	isUserOwner,
} from "@/lib/client.lib";
import type { Comment as CommentSchema } from "@/schemas/backend.schemas";
import CustomButton from "./CustomButton";
import UserIcon from "./UserIcon";

type Comment = z.infer<typeof CommentSchema>;

interface CommentItemProps {
	comment: Comment;
	projectId: string;
	taskId: string;
	projectOwnerId: string;
	currentUserId: string;
}

function CommentItem({
	comment,
	projectId,
	taskId,
	projectOwnerId,
	currentUserId,
}: CommentItemProps) {
	const [isEditing, setIsEditing] = useState(false);
	const boundUpdateComment = updateComment.bind(
		null,
		projectId,
		taskId,
		comment.id,
	);
	const [stateUpdate, actionUpdate, pendingUpdate] = useActionState(
		boundUpdateComment,
		undefined,
	);
	const canEdit = canEditComment(
		comment.authorId,
		projectOwnerId,
		currentUserId,
	);

	const handleDelete = async () => {
		const confirmed = window.confirm(
			"Voulez-vous vraiment supprimer ce commentaire ?",
		);
		if (confirmed) {
			await deleteComment(projectId, taskId, comment.id);
		}
	};

	return (
		<li className="min-w-190 flex gap-3.5">
			<UserIcon
				user={getInitialsFromName(comment.author.name)}
				variant="Comment"
				bg={
					isUserOwner(comment.authorId, projectOwnerId)
						? "bg-brand-light"
						: "bg-gray-200"
				}
			/>
			<div className="flex flex-col px-3.5 py-4.5 bg-gray-100 gap-4.5 rounded-[10px] flex-1">
				<div className="flex flex-row justify-between items-center">
					<p className="body-s text-black">{comment.author.name}</p>
					<p className="body-2xs text-gray-600">{comment.createdAt}</p>
				</div>

				{isEditing ? (
					<form action={actionUpdate} className="flex flex-col gap-2">
						<label htmlFor={`edit-comment-${comment.id}`} className="sr-only">
							Modifier le commentaire
						</label>
						<input
							id={`edit-comment-${comment.id}`}
							type="text"
							name="content"
							defaultValue={comment.content}
							className="flex px-3.5 py-2 bg-white border rounded-md text-black body-2xs"
						/>
						{stateUpdate && !stateUpdate.ok && (
							<p role="alert" className="text-red-500 text-xs">
								{stateUpdate.message}
							</p>
						)}
						<div className="flex gap-2 place-self-end">
							<button
								type="submit"
								disabled={pendingUpdate}
								className="px-3 py-1 bg-brand text-white rounded-md text-sm disabled:opacity-50"
							>
								{pendingUpdate ? "Enregistrement..." : "Enregistrer"}
							</button>
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="px-3 py-1 border rounded-md text-sm"
							>
								Annuler
							</button>
						</div>
					</form>
				) : (
					<p className="body-2xs text-black">{comment.content}</p>
				)}

				{canEdit && !isEditing && (
					<div className="flex flex-row gap-3.75 items-center place-self-end">
						<button
							className="flex gap-2 flex-nowrap items-center cursor-pointer"
							type="button"
							onClick={handleDelete}
						>
							<Trash2 size={14} stroke="#6B7280" />
							<span className="text-gray-600 body-xs">Supprimer</span>
						</button>
						<span className="text-gray-400 text-[11px]">|</span>
						<button
							className="flex gap-2 flex-nowrap items-center cursor-pointer"
							type="button"
							onClick={() => setIsEditing(true)}
						>
							<PencilLine size={14} stroke="#6B7280" />
							<span className="text-gray-600 body-xs">Modifier</span>
						</button>
					</div>
				)}
			</div>
		</li>
	);
}

export default function Comments({
	projectId,
	taskId,
	comments,
	projectOwnerId,
	currentUserId,
	userInitial,
}: {
	projectId: string;
	taskId: string;
	comments?: Comment[];
	projectOwnerId: string;
	currentUserId: string;
	userInitial: string;
}) {
	const boundCreateComment = createComment.bind(null, projectId, taskId);
	const [stateCreate, actionCreate, pendingCreate] = useActionState(
		boundCreateComment,
		undefined,
	);

	return (
		<div className="flex flex-col gap-4">
			<ul className="flex flex-col gap-4">
				{comments?.map((c) => (
					<CommentItem
						key={`${c.id}-${c.updatedAt}`}
						comment={c}
						projectId={projectId}
						taskId={taskId}
						projectOwnerId={projectOwnerId}
						currentUserId={currentUserId}
					/>
				))}
			</ul>
			<div className="min-w-190 flex gap-3.5">
				<UserIcon user={userInitial} variant="Comment" />
				<form
					action={actionCreate}
					aria-label="Formulaire d'ajout de commentaire"
					className="flex flex-col gap-2 flex-1"
				>
					<input
						id="new-comment"
						type="text"
						name="content"
						aria-label="Ajouter un commentaire"
						placeholder="Ajouter un commentaire..."
						className="flex px-3.5 py-4.5 bg-gray-50 text-black
						 body-2xs w-fit lg:min-w-140 rounded-[10px]"
					/>
					{stateCreate && !stateCreate.ok && (
						<p role="alert" className="text-red-500 text-xs mt-1">
							{stateCreate.message}
						</p>
					)}
					<div className="flex w-fit lg:place-self-end">
						<CustomButton
							label="Envoyer"
							pending={pendingCreate}
							disabled={false}
							buttonType="submit"
						/>
					</div>
				</form>
			</div>
		</div>
	);
}
