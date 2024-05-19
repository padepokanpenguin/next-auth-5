import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { resetPasswordByEmail } from "@/data/reset-password-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export async function generateTwoFactorToken(email: string) {
    const token = crypto.randomInt(100_000, 1_000_0000).toString()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email)

    if (existingToken) {
        await db.twoFactorToken.delete({ where: { id: existingToken.id }})
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken
}

export async function generateResetPasswordToken(email: string) {
    const token = uuid()
    const expires = new Date(new Date().getTime() + 3600 * 1000 )

    const existingToken = await resetPasswordByEmail(email)

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id}
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken

}


export async function generatVerificationToken(email: string) {
    const token = uuid()
    const expires = new Date(new Date().getTime() + 3600 * 1000 )

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken
}