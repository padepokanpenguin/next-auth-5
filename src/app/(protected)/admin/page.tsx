"use client"

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useCurrentRole } from "@/hooks/use-current-role"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"
import { on } from "stream"

export default function AdminPage() {
    const onServerActionClick = () => {
        admin().
        then(res => {
            if (res.errors) {
                toast.error(res.errors)
            }

            if (res.message) {
                toast.success(res.message)
            }
        })
    }

    const apiRoute = () => {
        fetch("/api/admin").
        then(res => {
            console.log(res)
            if (res.ok) {
                toast.success("Allowed API Route")
            } else {
                toast.error("FORBIDDEN")
            }
        })
    }


    return <Card className="w-[600px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">👨🏻‍💼 Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
                <FormSuccess message="You're allowed to see this content" />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only API Route
                </p>
                <Button onClick={apiRoute}>
                    Click to test
                </Button>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p className="text-sm font-medium">
                    Admin-only Server Action
                </p>
                <Button onClick={onServerActionClick}>
                    Click to test
                </Button>
            </div>
        </CardContent>
    </Card>
}