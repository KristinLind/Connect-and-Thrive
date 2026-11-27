
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default function ConnectionsPage() {
    return (
        <Suspense
            fallback={
                <main style={{ padding: "40px" }}>
                    Loading connections...
                </main>
            }
        >
            <ConnectionsContent />
        </Suspense>
    );
}

async function ConnectionsContent() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const userId = session.user.id;

    const access = await prisma.userAccess.findUnique({
        where: { authUserId: userId },
    });

    if (access?.status === "BLOCKED") {
        redirect("/blocked");
    }

    if (access?.status !== "APPROVED") {
        redirect("/pending-approval");
    }

    // Load connection requests involving the signed-in member.
    // Include the unread incoming message count for each connection.
    const requests = await prisma.connectionRequest.findMany({
        where: {
            OR: [
                { senderId: userId },
                { recipientId: userId },
            ],
        },
        include: {
            sender: {
                include: { profile: true },
            },
            recipient: {
                include: { profile: true },
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            readAt: null,
                            senderId: {
                                not: userId,
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const receivedRequests = requests.filter(
        (request) =>
            request.recipientId === userId &&
            request.status === "PENDING"
    );

    const sentRequests = requests.filter(
        (request) =>
            request.senderId === userId &&
            request.status === "PENDING"
    );

    const acceptedConnections = requests.filter(
        (request) => request.status === "ACCEPTED"
    );

    const sections = [
        {
            title: "Received Requests",
            description:
                "Connection requests from members who would like to get to know you.",
            message: "You have no connection requests yet.",
            members: receivedRequests.map((request) => ({
                id: request.id,
                name:
                    request.sender.profile?.shareProfile
                        ? request.sender.profile.displayName
                        : "Member",
                status: request.status,
                unreadCount: 0,
            })),
        },
        {
            title: "Sent Requests",
            description: "Requests you've sent to other members.",
            message: "You haven't sent any connection requests yet.",
            members: sentRequests.map((request) => ({
                id: request.id,
                name:
                    request.recipient.profile?.shareProfile
                        ? request.recipient.profile.displayName
                        : "Member",
                status: request.status,
                unreadCount: 0,
            })),
        },
        {
            title: "My Connections",
            description:
                "Members you've mutually agreed to connect with.",
            message: "Your accepted connections will appear here.",
            members: acceptedConnections
                .map((request) => {
                    const otherMember =
                        request.senderId === userId
                            ? request.recipient
                            : request.sender;

                    return {
                        id: request.id,
                        name: otherMember.profile?.shareProfile
                            ? otherMember.profile.displayName
                            : "Member",
                        status: request.status,
                        unreadCount: request._count.messages,
                    };
                })
                .sort((a, b) => b.unreadCount - a.unreadCount),
        },
    ];

    return (
        <main
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                padding: "24px",
            }}
        >
            <Link
                href="/members"
                style={{
                    color: "#087b83",
                    fontWeight: 600,
                    textDecoration: "none",
                }}
            >
                ← Back to Members
            </Link>

            <h1
                style={{
                    color: "#20364d",
                    marginTop: "24px",
                }}
            >
                My Connections
            </h1>

            <p
                style={{
                    color: "#64748b",
                    lineHeight: 1.7,
                }}
            >
                Build meaningful friendships at your own pace.
                Connection requests require mutual agreement before
                private messaging becomes available.
            </p>

            <div
                style={{
                    display: "grid",
                    gap: "24px",
                    marginTop: "32px",
                }}
            >
                {sections.map((section) => (
                    <section
                        key={section.title}
                        style={{
                            backgroundColor: "#ffffff",
                            padding: "28px",
                            borderRadius: "16px",
                            borderTop: "5px solid #087b83",
                            boxShadow:
                                "0 8px 24px rgba(32, 54, 77, 0.10)",
                        }}
                    >
                        <h2
                            style={{
                                color: "#20364d",
                                marginTop: 0,
                            }}
                        >
                            {section.title}
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            {section.description}
                        </p>

                        <div
                            style={{
                                backgroundColor: "#f0f8f7",
                                borderRadius: "10px",
                                padding: "20px",
                                color: "#64748b",
                                marginTop: "18px",
                            }}
                        >
                            {section.members.length === 0 ? (
                                section.message
                            ) : (
                                <div
                                    style={{
                                        display: "grid",
                                        gap: "12px",
                                    }}
                                >
                                    {section.members.map((member) => {
                                        const isReceivedRequest =
                                            section.title ===
                                            "Received Requests";

                                        const isAcceptedConnection =
                                            section.title ===
                                            "My Connections";

                                        const hasUnreadMessages =
                                            isAcceptedConnection &&
                                            member.unreadCount > 0;

                                        const cardStyle = {
                                            display: "block",
                                            backgroundColor:
                                                hasUnreadMessages
                                                    ? "#fff0ed"
                                                    : "#ffffff",
                                            padding: "16px",
                                            borderRadius: "10px",
                                            border: hasUnreadMessages
                                                ? "1px solid #ff7467"
                                                : "1px solid #d5e8e6",
                                            textDecoration: "none",
                                            cursor: isReceivedRequest
                                                ? "pointer"
                                                : "default",
                                        };

                                        const cardContent = (
                                            <>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                        gap: "12px",
                                                    }}
                                                >
                                                    <strong
                                                        style={{
                                                            color: "#20364d",
                                                        }}
                                                    >
                                                        {member.name}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            color: "#087b83",
                                                            fontSize: "0.85rem",
                                                        }}
                                                    >
                                                        {member.status}
                                                    </span>

                                                    {/* Unread message badge */}
                                                    {hasUnreadMessages && (
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-block",
                                                                backgroundColor:
                                                                    "#ff7467",
                                                                color: "#ffffff",
                                                                padding:
                                                                    "5px 12px",
                                                                borderRadius:
                                                                    "999px",
                                                                fontSize:
                                                                    "0.8rem",
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            {member.unreadCount}
                                                            {" unread "}
                                                            {member.unreadCount === 1
                                                                ? "message"
                                                                : "messages"}
                                                        </span>
                                                    )}

                                                    {/* Private messaging */}
                                                    {isAcceptedConnection && (
                                                        <Link
                                                            href={`/connections/${member.id}/messages`}
                                                            style={{
                                                                display:
                                                                    "inline-block",
                                                                padding:
                                                                    "9px 18px",
                                                                backgroundColor:
                                                                    "#087b83",
                                                                color: "#ffffff",
                                                                borderRadius:
                                                                    "8px",
                                                                textDecoration:
                                                                    "none",
                                                                fontSize:
                                                                    "0.95rem",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {hasUnreadMessages
                                                                ? member.unreadCount === 1
                                                                    ? "Read Message"
                                                                    : "Read Messages"
                                                                : "Message"}
                                                        </Link>
                                                    )}
                                                </div>

                                                {/* Received connection invitation */}
                                                {isReceivedRequest && (
                                                    <span
                                                        style={{
                                                            display: "block",
                                                            marginTop: "8px",
                                                            color: "#087b83",
                                                            fontSize: "1rem",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        View invitation →
                                                    </span>
                                                )}
                                            </>
                                        );

                                        return isReceivedRequest ? (
                                            <Link
                                                key={member.id}
                                                href={`/connections/${member.id}`}
                                                style={cardStyle}
                                            >
                                                {cardContent}
                                            </Link>
                                        ) : (
                                            <div
                                                key={member.id}
                                                style={cardStyle}
                                            >
                                                {cardContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
