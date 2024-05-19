"use client";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerificationToken } from "@/actions/new-verification";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";

export function NewVerificationForm() {
    const [error, setError] = useState<string|undefined>()
    const [success, setSuccess] = useState<string|undefined>()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(() =>{
        if (success || error) return

        if (!token) {
            setError("Missing token!")
            return
        }
        
        newVerificationToken(token).then(res => {
            setError(res.errors)
            setSuccess(res.message)
        }).catch(() => {
            setError("Something went wrong!")
        })
    }, [token, success, error])
    
    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return <CardWrapper headerLabel="Confirm Your Verification" backButtonHref="/auth/login" backButtonLabel="Back to login">
        <div className="flex items-center w-full justify-center">
            {!success && !error && <BeatLoader />}
            <FormSuccess message={success} />
            <FormError message={error} />
        </div>
    </CardWrapper>
}