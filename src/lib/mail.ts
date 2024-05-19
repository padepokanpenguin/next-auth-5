import { Resend }  from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export async function sendTwoFactorTokenEmail(email: string, token: string) {

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confrim your account",
        html: `<p>Your 2FA Code: ${token}</p>`
    })
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">Here</a> to confirm your account</p>`
    })
}

export async function sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your account</p>`
    })
}