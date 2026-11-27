import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import RespondToConnection from "@/components/connections/RespondToConnection";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function ConnectionDetailPage({ params }: PageProps) {
    return (
        <Suspense
            fallback={
                <main style={{ padding: "40px" }}>
                    Loading connection request...
                </main>
            }
        >
            <ConnectionDetailContent params={params} />
        </Suspense>
    );
}

async function ConnectionDetailContent({ params }: PageProps) {
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

    // Only the recipient can open this pending invitation.
    const connection = await prisma.connectionRequest.findFirst({
        where: {
            id,
            recipientId: session.user.id,
            status: "PENDING",
        },
        include: {
            sender: {
                include: {
                    profile: true,
                },
            },
        },
    });

    if (!connection) {
        notFound();
    }

    const senderProfile = connection.sender.profile;

    const senderName =
        senderProfile?.shareProfile
            ? senderProfile.displayName
            : "Member";

    return (
        <main
            style={{
                maxWidth: "750px",
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
                ← Back to Connections
            </Link>

            <article
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    padding: "36px",
                    marginTop: "24px",
                    borderTop: "6px solid #087b83",
                    boxShadow: "0 12px 30px rgba(32, 54, 77, 0.12)",
                    textAlign: "center",
                }}
            >
                <h1 style={{ color: "#20364d" }}>
                    Connection Invitation
                </h1>

                <h2 style={{ color: "#087b83" }}>
                    {senderName}
                </h2>

                <p
                    style={{
                        color: "#64748b",
                        lineHeight: 1.7,
                    }}
                >
                    This member would like to connect with you.
                    You can accept or decline the invitation.
                </p>

                <div
                    style={{
                        backgroundColor: "#f0f8f7",
                        padding: "20px",
                        borderRadius: "12px",
                        marginTop: "24px",
                    }}
                >
                    <p style={{ color: "#20364d" }}>
                        Status: <strong>Pending</strong>
                    </p>

                    <RespondToConnection requestId={connection.id} />
                </div>
            </article>
        </main>
    );
}
