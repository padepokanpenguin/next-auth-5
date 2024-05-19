import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/app/routes"

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req

    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) return undefined;

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return undefined
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        const encodedUrlComponent = encodeURIComponent(callbackUrl)
        return Response.redirect(new URL(`/auth/login?${encodedUrlComponent}`, nextUrl))
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/(api|trpc)(.*)', '/auth/login'],
  }