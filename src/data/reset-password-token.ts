import { db } from "@/lib/db";

export async function resetPasswordByToken(token: string) {
    try {
        const passwordToken = await db.passwordResetToken.findUnique({
            where: { token }
        })

        return passwordToken
    } catch (error) {
        return null
    }
}

export async function resetPasswordByEmail(email: string) {
    try {
        const passwordToken = await db.passwordResetToken.findFirst({
            where: { email }
        })

        return passwordToken
    } catch (error) {
        return null
    }
}