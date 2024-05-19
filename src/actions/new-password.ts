"use server"

import * as z from "zod";
import bcryptjs from "bcryptjs"
import { resetPasswordByToken } from "@/data/reset-password-token";
import { getUserByEmail } from "@/data/user";
import { newPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";

export async function newPassword(values: z.infer<typeof newPasswordSchema>, token?: string | null) {

    if(!token) {
        return { errors: "Missing token!" }
    }

    const validateFields = newPasswordSchema.safeParse(values)

    if (!validateFields) {
        return { errors: "Invalid fields!"}
    }

    const { password } = validateFields.data!


    const existingToken = await resetPasswordByToken(token)

    if (!existingToken) {
        return { errors: "Invalid token!" }
    }
    

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { errors: "token has expired"}
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) return { errors: "email doesnt exists"}

    const hashedPassword = await bcryptjs.hash(password, 10)

    await db.user.update({
        data: { password: hashedPassword },
        where: { id: existingUser.id}
    })

    await db.passwordResetToken.delete({ where: { id: existingToken.id }})

    return { message: "Password updated"}

}