import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// import bcrypt from "bcrypt"
import bcryptjs from "bcryptjs";
import { loginSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import github from "next-auth/providers/github";
import google from "next-auth/providers/google"

export default { 
    providers: [
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
        async authorize(credentials) {
            const validateFields = loginSchema.safeParse(credentials)

            if (validateFields) {
                const { email, password } = validateFields.data!

                const user = await getUserByEmail(email)

                if (!user || !user.password) return null

                const passwordMatch = await bcryptjs.compare(password, user.password)
                if (passwordMatch) return user
            }

            return null

        },
    })] 
} satisfies NextAuthConfig