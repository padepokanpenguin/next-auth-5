"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import Link from "next/link";


export function LoginForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""
    const [showTwoFactor, setShowTwoFactor] = useState(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    function onSubmit(values: z.infer<typeof loginSchema>){
        setSuccess("")
        setError("")
        startTransition(() => {
            login(values, callbackUrl).then(res => {
                if (res && res.message) { 
                    form.reset()
                    setSuccess(res.message)
                }

                if (res && res.errors) {
                    form.reset()
                    setError(res && res.errors) // Check if res is defined before accessing its properties
                }

                if (res && res?.twoFactor) {
                    setShowTwoFactor(true)
                }
            })
        })
    }

    return <CardWrapper headerLabel="Wellcome back" backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial>
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                > 
                <div className="space-y-4">
                    {showTwoFactor && (
                        <FormField 
                        control={form.control}
                        name="code"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input  
                                        {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    )}
                    {!showTwoFactor && (
                    <>
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input  
                                            {...field}
                                            disabled={isPending}
                                            type="email"
                                            placeholder="john.doe@example.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input  
                                            {...field}
                                            disabled={isPending}
                                            type="password"
                                            // placeholder="john.doe@example.com"
                                        />
                                    </FormControl>
                                    <Button size={"sm"} variant={"link"} asChild className="px-0 font-normal">
                                        <Link href="/auth/forgot-password">Forgot password?</Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>)}
                </div>
                <FormError message={error || urlError} />
                <FormSuccess message={success} />
                <Button
                    type="submit"
                    className="w-full"
                >
                    {showTwoFactor ? "Confirm" : "Login"}
                </Button>
            </form>
        </Form>
    </CardWrapper>
}