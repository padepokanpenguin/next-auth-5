"use client";

import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname()
    
    return <nav className="bg-secondary w-[600px] flex justify-between items-center p-4 rounded-xl shadow-sm">
        <div className="flex gap-x-2">
            <Button variant={pathname == "/server" ? "default" : "outline"} asChild>
                <Link href="/server">Server</Link>
            </Button>
            <Button variant={pathname == "/client" ? "default" : "outline"} asChild>
                <Link href="/client">Client</Link>
            </Button>
            <Button variant={pathname == "/admin" ? "default" : "outline"} asChild>
                <Link href="/admin">Admin</Link>
            </Button>
            <Button variant={pathname == "/settings" ? "default" : "outline"} asChild>
                <Link href="/settings">Setting</Link>
            </Button>
        </div>
        <UserButton />
        </nav>
}