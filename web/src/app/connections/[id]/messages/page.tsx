import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import ConversationChat from "@/components/connections/ConversationChat";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function MessagesPage({ params }: PageProps) {
    return (
        <Suspense
            fallback={
                <main style={{ padding: "40px" }}>
                    Loading conversation...
                </main>
            }
        >
            <MessagesContent params={params} />
        </Suspense>
    );
}

async function MessagesContent({ params }: PageProps) {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const access = await prisma.userAccess.findUnique({
        where: { authUserId: session.user.id },
    });

    if (access?.status === "BLOCKED") {
        redirect("/blocked");
    }

    if (access?.status !== "APPROVED") {
        redirect("/pending-approval");
    }

    const { id } = await params;

    // Only approved participants in an accepted connection
    // can open this conversation.
    const connection = await prisma.connectionRequest.findFirst({
        where: {
            id,
            status: "ACCEPTED",
            OR: [
                { senderId: session.user.id },
                { recipientId: session.user.id },
            ],
            sender: {
                status: "APPROVED",
                profile: {
                    is: { allowMessages: true },
                },
            },
            recipient: {
                status: "APPROVED",
                profile: {
                    is: { allowMessages: true },
                },
            },
        },
        include: {
            sender: { include: { profile: true } },
            recipient: { include: { profile: true } },
        },
    });

    if (!connection) {
        notFound();
    }

    const otherMember =
        connection.senderId === session.user.id
            ? connection.recipient
            : connection.sender;

    const otherName = otherMember.profile?.shareProfile
        ? otherMember.profile.displayName
        : "Connected Member";

    return (
        <main
            style={{
                maxWidth: "850px",
                margin: "40px auto",
                padding: "24px",
            }}
        >
            <Link
                href="/connections"
                style={{
                    color: "#087b83",
                    fontWeight: 600,
                    textDecoration: "none",
                }}
            >
                ← Back to My Connections
            </Link>

            <section
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    borderTop: "6px solid #087b83",
                    padding: "28px",
                    marginTop: "24px",
                    boxShadow: "0 12px 30px rgba(32, 54, 77, 0.10)",
                }}
            >
                <h1
                    style={{
                        color: "#20364d",
                        marginTop: 0,
                    }}
                >
                    Conversation with {otherName}
                </h1>

                <p style={{ color: "#64748b" }}>
                    Your private conversation is visible only to
                    the two connected members.
                </p>

                <ConversationChat
                    connectionId={connection.id}
                    currentUserId={session.user.id}
                />
            </section>
        </main>
    );
}
