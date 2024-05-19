"use server";
import { registerSchema } from "@/schemas";
import * as z from "zod";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generatVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export async function register(values: z.infer<typeof registerSchema>) {
    const validateFields = registerSchema.safeParse(values)

    if (!validateFields) {
        return { errors: "Invalid fields!" }
    }

    const {name, email, password} = validateFields.data!

    const hashPassword = await bcryptjs.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { errors: "Email already in use" }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashPassword
        }
    })

    const verificationToken = await generatVerificationToken(email)

    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { message: "User was created successfully!"}
}