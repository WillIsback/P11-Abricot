import UserIcon from "../UserIcon/UserIcon"

export default function Comment ({}){
  return (
    <div className="flex flex-col gap-5">
      <div className="min-w-190 flex gap-9.5">
        <UserIcon user="BD"/>
        <div className="flex flex-col px-3.5 py-4.5 bg-gray-100 gap-4.5 rounded-[10px]">
          <div className="flex flex-row justify-between items-center">
            <p className="body-s text-black">Bertrand Dupont</p>
            <p className="body-2xs text-gray-600">23 mars, 11:20</p>
          </div>
          <p className="body-2xs text-black">Attention à bien gérer l'expiration des tokens et le refresh automatique côté client.</p>
        </div>
      </div>
        <div className="min-w-190 flex gap-9.5">
          <UserIcon user="AD"/>
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