"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "../ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes"
// import { signIn } from "@/auth"
import { signIn } from 'next-auth/react';

export function Social() {
    const onClick = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        })
    }

    return <div className="flex items-center w-full gap-x-2">
        <Button size={"lg"} className="w-full" variant={"outline"} onClick={() => onClick("google")}>
            <FcGoogle className="w-5 h-5" />
        </Button>

        <Button size={"lg"} className="w-full" variant={"outline"} onClick={() => onClick("github")}>
            <FaGithub className="w-5 h-5" />
        </Button>
    </div>
}