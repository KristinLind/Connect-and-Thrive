"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GroupApprovalActionsProps = {
    groupId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    updatedAt: string;
    reviewFeedback?: string | null;
    hasCreator?: boolean;
};

export function GroupApprovalActions({
    groupId,
    status,
    updatedAt,
    reviewFeedback,
    hasCreator = false,
}: GroupApprovalActionsProps) {
    const router = useRouter();

    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [feedback, setFeedback] = useState(
        reviewFeedback ?? ""
    );

    async function reviewGroup(
        action: "approve" | "reject" | "feedback",
    ) {
        if (pending) return;

        setError("");
        setPending(true);

        try {
            const response = await fetch(
                "/api/admin/groups",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        groupId,
                        action,
                        updatedAt,
                        feedback,
                    }),
                },
            );

            const result = await response
                .json()
                .catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ??
                    "Could not update the group.",
                );
                return;
            }

            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setPending(false);
        }
    }

    if (status === "APPROVED") {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginTop: 18,
            }}
        >
            <label
                htmlFor={`feedback-${groupId}`}
                style={{
                    color: "#20364d",
                    fontWeight: 600,
                }}
            >
                Private administrator feedback
            </label>

            <textarea
                id={`feedback-${groupId}`}
                value={feedback}
                onChange={(event) =>
                    setFeedback(event.target.value)
                }
                disabled={pending}
                maxLength={3000}
                rows={4}
                placeholder="Provide helpful guidance or encouragement to the group creator..."
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 12,
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    fontFamily: "inherit",
                    fontSize: "1rem",
                    resize: "vertical",
                }}
            />

            <p
                style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    margin: 0,
                }}
            >
                Feedback is private between administrators
                and the group creator.
            </p>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => reviewGroup("approve")}
                    style={{
                        background: "#087b83",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 18px",
                        fontWeight: 600,
                        cursor: pending ? "wait" : "pointer",
                    }}
                >
                    {pending
                        ? "Processing..."
                        : status === "REJECTED"
                            ? "Approve previously rejected group"
                            : "Approve group"}
                </button>

                {status === "PENDING" && (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => reviewGroup("reject")}
                        style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                            padding: "10px 18px",
                            fontWeight: 600,
                            cursor: pending ? "wait" : "pointer",
                        }}
                    >
                        Reject group
                    </button>
                )}

                {status === "REJECTED" && hasCreator && (
                    <button
                        type="button"
                        disabled={pending || !feedback.trim()}
                        onClick={() => reviewGroup("feedback")}
                        style={{
                            background: "#ffffff",
                            color: "#087b83",
                            border: "1px solid #087b83",
                            borderRadius: 8,
                            padding: "10px 18px",
                            fontWeight: 600,
                            cursor:
                                pending || !feedback.trim()
                                    ? "not-allowed"
                                    : "pointer",
                        }}
                    >
                        Send feedback
                    </button>
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    style={{
                        color: "#991b1b",
                        margin: "5px 0",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
