"use server"

import * as z from "zod";
import bcryptjs from "bcryptjs"
import { update } from "@/auth"
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generatVerificationToken } from "@/lib/token";
import { settingSchema } from "@/schemas";


export async function settings(values: z.infer<typeof settingSchema>) {
    const user = await currentUser()

    if (!user) return { errors: "Unauthorized!"}
    
    const dbUser = await getUserById(user.id!)

    if (!dbUser) return { errors: "Unauthorized!"}

    if (user.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email)

        if (existingUser && existingUser.id !== user.id) return { errors: "Email already in used"}

        const verificationToken = await generatVerificationToken(values.email)

        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return { message: "Verification email sent!"}
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passsowrdMatch = await bcryptjs.compare(values.password, dbUser.password)

        if (!passsowrdMatch) return { errors: "Incorrect password"}

        const hashedPassword = await bcryptjs.hash(values.newPassword, 10)

        values.password = hashedPassword
        values.newPassword = undefined
    }  

   const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values!
        }
    })

    // await update({
    //     user: {
    //         name: updatedUser.email,
    //         email: updatedUser.email,
    //         isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    //         role: updatedUser.role
    //     }
    // })

    return { message: "Settings Updated"}
}