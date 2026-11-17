"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type Status = "PENDING" | "APPROVED" | "BLOCKED";

export function AccessActions({
    authUserId,
    status,
}: {
    authUserId: string;
    status: Status;
}) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function updateAccess(action: "approve" | "block" | "unblock") {
        setError("");
        setPending(true);

        try {
            const response = await fetch("/api/admin/access", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authUserId, action }),
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                setError(result?.error || "Could not update access.");
                return;
            }

            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setPending(false);
        }
    }

    return (
        <span>
            {status === "PENDING" && (
                <button disabled={pending} onClick={() => updateAccess("approve")}>
                    Approve
                </button>
            )}

            {status === "APPROVED" && (
                <button disabled={pending} onClick={() => updateAccess("block")}>
                    Block
                </button>
            )}

            {status === "BLOCKED" && (
                <button disabled={pending} onClick={() => updateAccess("unblock")}>
                    Unblock
                </button>
            )}

            {error && <span role="alert">{error}</span>}
        </span>
    );
}