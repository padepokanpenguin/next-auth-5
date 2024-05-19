"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FaUser } from "react-icons/fa"
import LogoutButton from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"

export default function UserButton() {
    const user = useCurrentUser()

    return <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-sky-500">
                    <FaUser className="text-white" />
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem>
                <LogoutButton>
                    <ExitIcon className="w-4 h-4 mr-2" />
                    Logout
                </LogoutButton>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}