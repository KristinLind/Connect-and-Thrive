"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GroupReviewNotificationProps = {
    groupId: string;
    status: "APPROVED" | "REJECTED";
    reviewedAt: string;
};

export function GroupReviewNotification({
    groupId,
    status,
    reviewedAt,
}: GroupReviewNotificationProps) {
    const router = useRouter();

    const [pending, setPending] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);
    const [error, setError] = useState("");

    const approved = status === "APPROVED";

    async function markAsRead() {
        if (pending || acknowledged) return;

        setPending(true);
        setError("");

        try {
            const response = await fetch(
                `/api/groups/${groupId}/review-notification`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reviewedAt,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    "Unable to acknowledge notification."
                );
            }

            setAcknowledged(true);
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setPending(false);
        }
    }

    if (acknowledged) return null;

    return (
        <div
            style={{
                background: approved ? "#f0f9f9" : "#fff4f1",
                border: approved
                    ? "1px solid #b8dddd"
                    : "1px solid #f3c7bd",
                borderRadius: 12,
                padding: 16,
                marginTop: 12,
            }}
        >
            <strong
                style={{
                    color: approved ? "#087b83" : "#b94437",
                }}
            >
                {approved
                    ? "Your group has been approved!"
                    : "Your group approval update"}
            </strong>

            <p
                style={{
                    marginTop: 8,
                    marginBottom: 12,
                    lineHeight: 1.6,
                }}
            >
                {approved
                    ? "Congratulations! Other approved members can now discover and join your group."
                    : "Your group has not been approved at this time. Please review any guidance provided by your administrator. Your group may be reconsidered for approval and will remain private until approved."}
            </p>

            <button
                type="button"
                onClick={markAsRead}
                disabled={pending}
                style={{
                    background: "#087b83",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 600,
                    cursor: pending ? "wait" : "pointer",
                    opacity: pending ? 0.7 : 1,
                }}
            >
                {pending ? "Saving..." : "Mark as read"}
            </button>

            {error && (
                <p
                    role="alert"
                    style={{
                        color: "#b91c1c",
                        marginTop: 8,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
