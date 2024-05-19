"use server";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generatVerificationToken, generateTwoFactorToken } from "@/lib/token";
import { loginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export async function login(values: z.infer<typeof loginSchema>) {
    const validateFields = loginSchema.safeParse(values)

    if (!validateFields) {
        return { errors: "Invalid fields!" }
    }

    const { email, password, code } = validateFields.data!

    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Your email or password was wrong" }
    } 

    if (!existingUser.emailVerified) {
        const verificationToken = await generatVerificationToken(existingUser.email)

        await sendVerificationEmail(existingUser.email, verificationToken.token)
        return { message: "Confirmation email was sent"}
    }   

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

            if (!twoFactorToken) return { errors: "Invalid code!"}

            if (twoFactorToken.token !== code) return { errors: "Invalid code!"}
            
            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if (hasExpired) return { errors: "code expired"}

            await db.twoFactorToken.delete({where: { id: twoFactorToken.id }})

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id }})
            }

            await db.twoFactorConfirmation.create({ data: { userId: existingUser.id }})
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
    
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
    
            return { twoFactor: true }
        }

    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })



        return { message: "Login Success" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { errors: "Invalid credentials!" }
                default:
                    return { errors: "something went wrong!" }
            }
        }

        throw error
    }

}