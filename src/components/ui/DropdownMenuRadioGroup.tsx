"use client"
import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const enum Status {
    TODO='TODO',
    IN_PROGRESS='IN_PROGRESS',
    DONE='DONE',
    CANCELED='CANCELED'
} 


export default function DropdownMenuRadioGroupDemo() {
    const [selectedStatus, setSelectedStatus] = React.useState<Status>(Status.TODO)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const createQueryString = React.useCallback(
        (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
    
        return params.toString()
        },
        [searchParams]
    )
    React.useEffect(()=>{
        router.push(pathname+'?'+createQueryString('status',selectedStatus))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedStatus])

    return (
        <div className="flex w-fit gap-4 items-center justify-center border
            border-gray-200 rounded-xl px-8 py-5.75">
            <p className="body-s text-gray-600">Statut</p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="group">
                        <ChevronDown
                            strokeWidth={1}
                            className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32">
                    <DropdownMenuGroup>
                        <DropdownMenuRadioGroup
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as Status)}
                        >
                            <DropdownMenuRadioItem value="TODO">A faire</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="IN_PROGRESS">En cours</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="DONE">Terminée</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="CANCELED">Abandonnée</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
