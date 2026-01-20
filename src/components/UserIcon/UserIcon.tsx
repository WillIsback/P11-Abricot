export default function UserIcon ({ user }: {user : string}){
    return (
        <button
            type="button" 
            className="group flex rounded-full w-16.25 h-16.25 justify-center items-center bg-brand-light hover:bg-brand-dark focus:bg-brand-dark">
            <span className="caption-l text-gray-950 group-hover:text-white group-focus:text-white">{user}</span>
        </button>
    )
}