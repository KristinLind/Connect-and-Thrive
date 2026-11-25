"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StoryReviewActions({ storyId }: { storyId: string }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function review(status: "APPROVED" | "REJECTED") {
        setError("");
        setPending(true);
        try {
            const response = await fetch(`/api/stories/${storyId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                const result = await response.json().catch(() => null);
                setError(result?.error ?? "Could not review story.");
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
        <div>
            <button disabled={pending} onClick={() => review("APPROVED")}>Approve story</button>{" "}
            <button disabled={pending} onClick={() => review("REJECTED")}>Reject story</button>
            {error && <p role="alert">{error}</p>}
        </div>
    );
}
