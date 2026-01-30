import LogoBrandDark from "@/assets/logo/loge_brand_dark.svg"
import MenuItems from "../ui/MenuItems"
import UserIcon from "../ui/UserIcon"
import Link from "next/link"

export default function Menu ({userInitial}:{userInitial : string}){
    return (
        <header className="flex flex-row w-full px-25 items-center justify-between py-2 bg-white h-fit">
            <Link href='/'>
                <LogoBrandDark
                    className="w-36.75 h-auto"
                    viewBox="0 0 253 33"
                    width={undefined}
                    height={undefined}
                />
            </Link>
            <MenuItems />
            <UserIcon user={userInitial}/>
        </header>
    )
}