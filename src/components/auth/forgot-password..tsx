"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { resetSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";



export function ForgotPasswordForm() {
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: ""
        }
    })

    function onSubmit(values: z.infer<typeof resetSchema>){
        setSuccess("")
        setError("")
        console.log("reset", values)
        startTransition(() => {
            reset(values).then(res => {
                if (res && res.message) { 
                    setSuccess(res.message)
                }
                setError(res && res.errors)
            })
        })
    }

    return <CardWrapper headerLabel="Forgot Password" backButtonLabel="Back to login?" backButtonHref="/auth/login">
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                > 
                <div className="space-y-4">
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