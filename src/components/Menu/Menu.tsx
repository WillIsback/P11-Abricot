import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg"
import MenuItems from "../ui/MenuItems"
import UserIcon from "../ui/UserIcon"


export default function Menu ({userInitial}:{userInitial : string}){
    return (
        <header className="flex flex-row max-w-1440 px-25 items-center justify-between py-2 ">
            <LogoBrandDark
                className="w-36.75 h-auto"
                viewBox="0 0 253 33"
                width={undefined}
                height={undefined}
            />
            <MenuItems />
            <UserIcon user={userInitial}/>
        </header>
    )
}