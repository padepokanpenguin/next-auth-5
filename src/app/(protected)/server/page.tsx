import { auth } from "@/auth"
import { UserInfo } from "@/components/user-info"
import { currentUser } from "@/lib/auth"
import { User } from "@prisma/client"

export default async function ServerPage() {
    const user = await currentUser()

    return <UserInfo user={user as User} label="Server Component" /> // Cast the user object to the User type
}