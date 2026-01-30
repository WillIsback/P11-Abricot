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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { mapStatusString } from "@/lib/client.lib"
const enum Status {
    TODO='TODO',
    IN_PROGRESS='IN_PROGRESS',
    DONE='DONE',
    CANCELED='CANCELED',
    ALL='ALL'
}

export default function DropdownStatusMenu() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    // Initialiser depuis l'URL, ou "ALL" par défaut
    const currentStatus = searchParams.get('status') || 'ALL'
    const [selectedStatus, setSelectedStatus] = React.useState<string>(currentStatus)

    // Synchroniser l'état avec l'URL quand elle change (navigation back/forward)
    React.useEffect(() => {
        const urlStatus = searchParams.get('status') || 'ALL'
        setSelectedStatus(urlStatus)
    }, [searchParams])

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value)
        const params = new URLSearchParams(searchParams.toString())

        if (value === 'ALL') {
            params.delete('status')
        } else {
            params.set('status', value)
        }

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex w-fit gap-4 items-center justify-center border
            border-gray-200 rounded-xl px-8 py-5.75">
            <p className="body-s text-gray-600">Statut</p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="group">
                        <p className="body-s">
                            {selectedStatus === 'ALL' ? 'Tous' : mapStatusString[selectedStatus as Status]}
                        </p>
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
                            onValueChange={handleStatusChange}
                        >
                            <DropdownMenuRadioItem value="ALL">Tous</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="TODO">À faire</DropdownMenuRadioItem>
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
