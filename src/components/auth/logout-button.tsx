"use client";

import { logout } from "@/actions/logout";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
    children: React.ReactNode
}

export default function LogoutButton({children}: LogoutButtonProps) {
    function onClick() {
        // signOut()
        logout()
    }

    return <span onClick={onClick} className="cursor-pointer">{children}</span> 
}