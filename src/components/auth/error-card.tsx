import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { CardWrapper } from "@/components/auth/card-wrapper";

export function ErrorCard() {
    return (
        <CardWrapper headerLabel="Oops!! Something went wrong" backButtonHref="/auth/login" backButtonLabel="Back to Login">
            <div className="flex justify-center items-center w-full">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
            </div>
        </CardWrapper>
    )
}