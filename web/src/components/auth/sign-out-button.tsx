"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleSignOut() {
        setPending(true);

        try {
            await authClient.signOut();
            router.replace("/sign-in");
            router.refresh();
        } finally {
            setPending(false);
        }
    }

    return (
        <button type="button" onClick={handleSignOut} disabled={pending}>
            {pending ? "Signing out…" : "Sign out"}
        </button>
    );
}