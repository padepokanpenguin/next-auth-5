import { UserRole } from "@prisma/client";
import * as z from "zod";

export const settingSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6))
}).
    refine(data => {
        if (data.password && !data.newPassword) {
            return false
        }
        return true
    }, {
        message: "New password is required when changing password",
        path: ["newPassword"]
    })
    .refine(data => {
        if (!data.password && data.newPassword) {
            return false
        }

        return true
    }, {
        message: "password is required when changing password",
        path: ["password"]
    })

export const newPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required"
    })
})

export const resetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})

export const loginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string())
})

export const registerSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Password is required"
    }),
    name: z.string().min(1, {
        message: 'Name is required'
    })
})

