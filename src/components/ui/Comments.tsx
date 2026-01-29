import UserIcon from "./UserIcon"
import { Comment } from "@/schemas/backend.schemas"
import { getInitialsFromName } from "@/lib/client.lib";
import { isUserOwner } from "@/lib/client.lib";
import * as z from 'zod';

type Comment = z.infer<typeof Comment>;

export default function Comments ({ comments, projectOwner }: { comments?: Comment[], projectOwner: string }) {
  comments?.map((c)=>c.author)
  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-5">
      { comments?.map((c)=>{
        return (
          <li className="min-w-190 flex gap-9.5" key={c.id}>
            <UserIcon
              user={getInitialsFromName(c.author.name)}
              variant="Comment"
              bg={isUserOwner(c.authorId,projectOwner)?'bg-brand-light':'bg-gray-200'}
            />
            <div className="flex flex-col px-3.5 py-4.5 bg-gray-100 gap-4.5 rounded-[10px]">
              <div className="flex flex-row justify-between items-center">
                <p className="body-s text-black">{c.author.name}</p>
                <p className="body-2xs text-gray-600">{c.createdAt}</p>
              </div>
              <p className="body-2xs text-black">{c.content}</p>
            </div>
          </li>
        )
        })
      }
      </ul>
        <div className="min-w-190 flex gap-9.5">
          <UserIcon user="AD" variant="Comment"/>
          <form>
            <input
              id="commentID"
              type="text"
              placeholder="Ajouter un commentaire..."
              className="flex px-3.5 py-4.5 bg-gray-100 text-black body-2xs min-w-140 rounded-[10px]"
            />
          </form>
        </div>

    </div>
  )
}
