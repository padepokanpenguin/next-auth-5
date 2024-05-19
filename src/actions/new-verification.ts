"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export async function newVerificationToken(token: string) {
    const exisitingToken = await getVerificationTokenByToken(token)

    if (!exisitingToken) return { errors: "Token doesn't exists!"}

    const hasExpired = new Date(exisitingToken.expires) < new Date()

    if (hasExpired) return { errors: "Token has expired!"}

    const existingUser = await getUserByEmail(exisitingToken.email)

    if (!existingUser) return { errors: "Email does'nt exist!"}

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: exisitingToken.email
        }
    })

    await db.verificationToken.delete({
        where: { id: exisitingToken.id }
    })

    return { message: "Email verified"}
}