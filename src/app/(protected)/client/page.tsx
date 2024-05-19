"use client"

// import { auth } from "@/auth"
import { UserInfo } from "@/components/user-info"
import { useCurrentUser } from "@/hooks/use-current-user"
import { currentUser } from "@/lib/auth"
import { User } from "@prisma/client"

export default function ServerPage() {
    const user =  useCurrentUser()

    return <UserInfo user={user as User} label="Client Component" /> // Cast the user object to the User type
}