"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/token";
import { resetSchema } from "@/schemas";
import * as z from "zod";

export async function reset(values: z.infer<typeof resetSchema>) {
    const validateFields = resetSchema.safeParse(values)

    if (!validateFields) return { errors: "Email was invalid!"}

    const { email } = validateFields.data!

    const existingUser = await getUserByEmail(email)

    if (!existingUser) return { errors: "Email not found!"}

    const passwordToken = await generateResetPasswordToken(email)

    await sendPasswordResetEmail(passwordToken.email, passwordToken.token)

    return { message: "Reset email sent"}
}