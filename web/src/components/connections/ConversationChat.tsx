"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
    id: string;
    connectionId: string;
    senderId: string;
    content: string;
    createdAt: string;
    readAt: string | null;
};

type ConversationChatProps = {
    connectionId: string;
    currentUserId: string;
};

export default function ConversationChat({
    connectionId,
    currentUserId,
}: ConversationChatProps) {
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadMessages = useCallback(async () => {
        const messageUrl =
            `/api/connections/${encodeURIComponent(connectionId)}/messages`;

        try {
            const response = await fetch(messageUrl, {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Unable to load messages.");
            }

            const data = await response.json();
            const loadedMessages: Message[] = data.messages;

            setMessages(loadedMessages);
            setError("");

            // Identify unread messages received from the other member.
            const unreadMessageIds = loadedMessages
                .filter(
                    (message) =>
                        message.senderId !== currentUserId &&
                        message.readAt === null
                )
                .map((message) => message.id);

            // Mark incoming messages as read.
            if (unreadMessageIds.length > 0) {
                const readResponse = await fetch(messageUrl, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messageIds: unreadMessageIds,
                    }),
                });

                if (!readResponse.ok) {
                    setError("Unable to update message read status.");
                    return;
                }

                // Refresh the notification bell and server components.
                router.refresh();
            }
        } catch {
            setMessages([]);
            setError("Unable to load messages. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [connectionId, currentUserId, router]);

    useEffect(() => {
        const initialLoad = window.setTimeout(() => {
            void loadMessages();
        }, 0);

        const interval = window.setInterval(() => {
            void loadMessages();
        }, 5000);

        return () => {
            window.clearTimeout(initialLoad);
            window.clearInterval(interval);
        };
    }, [loadMessages]);

    async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent || sending) return;

        setSending(true);
        setError("");

        try {
            const response = await fetch(
                `/api/connections/${encodeURIComponent(connectionId)}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: trimmedContent,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Unable to send message.");
            }

            setContent("");
            await loadMessages();
        } catch {
            setError("Unable to send your message. Please try again.");
        } finally {
            setSending(false);
        }
    }

    return (
        <div>
            <div
                aria-live="polite"
                style={{
                    minHeight: "260px",
                    maxHeight: "450px",
                    overflowY: "auto",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "18px",
                    marginBottom: "18px",
                }}
            >
                {loading ? (
                    <p style={{ color: "#64748b" }}>
                        Loading messages...
                    </p>
                ) : messages.length === 0 ? (
                    <p
                        style={{
                            color: "#64748b",
                            textAlign: "center",
                            marginTop: "80px",
                        }}
                    >
                        No messages yet. Say hello to start
                        your conversation!
                    </p>
                ) : (
                    messages.map((message) => {
                        const isMine =
                            message.senderId === currentUserId;

                        return (
                            <div
                                key={message.id}
                                style={{
                                    display: "flex",
                                    justifyContent: isMine
                                        ? "flex-end"
                                        : "flex-start",
                                    marginBottom: "14px",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "80%",
                                        padding: "12px 16px",
                                        borderRadius: "14px",
                                        backgroundColor: isMine
                                            ? "#087b83"
                                            : "#ffffff",
                                        color: isMine
                                            ? "#ffffff"
                                            : "#20364d",
                                        border: isMine
                                            ? "none"
                                            : "1px solid #e2e8f0",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    <div
                                        style={{
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {message.content}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            marginTop: "6px",
                                            opacity: 0.75,
                                            textAlign: "right",
                                        }}
                                    >
                                        {new Date(
                                            message.createdAt
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {error && (
                <p
                    role="alert"
                    style={{
                        color: "#b42318",
                        marginBottom: "12px",
                    }}
                >
                    {error}
                </p>
            )}

            <form onSubmit={sendMessage}>
                <label
                    htmlFor="conversation-message"
                    style={{
                        display: "block",
                        fontWeight: 600,
                        color: "#20364d",
                        marginBottom: "8px",
                    }}
                >
                    Your message
                </label>

                <textarea
                    id="conversation-message"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Write a friendly message..."
                    maxLength={2000}
                    rows={3}
                    disabled={sending}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "inherit",
                        fontSize: "1rem",
                        resize: "vertical",
                        boxSizing: "border-box",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "12px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => void loadMessages()}
                        disabled={loading}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#ffffff",
                            color: "#087b83",
                            border: "1px solid #087b83",
                            borderRadius: "9px",
                            cursor: "pointer",
                        }}
                    >
                        Refresh Messages
                    </button>

                    <button
                        type="submit"
                        disabled={sending || !content.trim()}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#087b83",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "9px",
                            fontWeight: 600,
                            cursor: "pointer",
                            opacity:
                                sending || !content.trim()
                                    ? 0.6
                                    : 1,
                        }}
                    >
                        {sending ? "Sending..." : "Send Message"}
                    </button>
                </div>
            </form>
        </div>
    );
}
