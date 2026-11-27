
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    requestId: string;
};

export default function RespondToConnection({ requestId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function respond(action: "ACCEPTED" | "DECLINED") {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/connections/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ action }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to update the request."
                );
            }

            router.push("/connections");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ marginTop: "24px" }}>
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => respond("ACCEPTED")}
                    style={{
                        backgroundColor: "#087b83",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "14px 24px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        cursor: loading ? "wait" : "pointer",
                    }}
                >
                    {loading ? "Processing..." : "✓ Accept Connection"}
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() => respond("DECLINED")}
                    style={{
                        backgroundColor: "#ffffff",
                        color: "#20364d",
                        border: "1px solid #94a3b8",
                        borderRadius: "10px",
                        padding: "14px 24px",
                        fontSize: "1rem",
                        fontWeight: 700,
                        cursor: loading ? "wait" : "pointer",
                    }}
                >
                    Decline Request
                </button>
            </div>

            {error && (
                <p role="alert" style={{ color: "#b42318" }}>
                    {error}
                </p>
            )}
        </div>
    );
}
