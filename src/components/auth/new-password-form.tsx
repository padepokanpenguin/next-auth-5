"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { newPasswordSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";



export function NewPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: ""
        }
    })

    function onSubmit(values: z.infer<typeof newPasswordSchema>){
        setSuccess("")
        setError("")
        console.log("reset", values)
        startTransition(() => {
            newPassword(values, token).then(res => {
                if (res && res.message) { 
                    setSuccess(res.message)
                }
                setError(res && res.errors)
            })
        })
    }

    return <CardWrapper headerLabel="Enter new Password" backButtonLabel="Back to login?" backButtonHref="/auth/login">
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                > 
                <div className="space-y-4">
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
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button
                    type="submit"
                    className="w-full"
                >
                    Reset Password
                </Button>
            </form>
        </Form>
    </CardWrapper>
}