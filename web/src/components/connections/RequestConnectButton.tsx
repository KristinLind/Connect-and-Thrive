
"use client";

import { useState } from "react";

type Props = {
    recipientId: string;
};

export default function RequestConnectButton({ recipientId }: Props) {
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [error, setError] = useState("");

    async function sendRequest() {
        setStatus("sending");
        setError("");

        try {
            const response = await fetch("/api/connections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recipientId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to send request.");
            }

            setStatus("sent");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
            setStatus("idle");
        }
    }

    return (
        <div style={{ textAlign: "center" }}>
            <button
                type="button"
                onClick={sendRequest}
                disabled={status !== "idle"}
                style={{
                    backgroundColor: "#087b83",
                    color: "#ffffff",
                    padding: "12px 26px",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    opacity: status === "idle" ? 1 : 0.65,
                    cursor: status === "idle" ? "pointer" : "not-allowed",
                }}
            >
                {status === "sending"
                    ? "Sending..."
                    : status === "sent"
                        ? "Request Sent!"
                        : "Request to Connect"}
            </button>

            {error && (
                <p role="alert" style={{ color: "#b91c1c", marginTop: "10px" }}>
                    {error}
                </p>
            )}

            {status === "sent" && (
                <p style={{ color: "#087b83", marginTop: "10px" }}>
                    Your invitation has been sent.
                </p>
            )}
        </div>
    );
}
