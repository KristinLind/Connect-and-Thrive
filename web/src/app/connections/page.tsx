
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export default function ConnectionsPage() {
    return (
        <Suspense fallback={<main style={{ padding: "40px" }}>Loading connections...</main>}>
            <ConnectionsContent />
        </Suspense>
    );
}

async function ConnectionsContent() {
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

    const sections = [
        {
            title: "Received Requests",
            description: "Connection requests from members who would like to get to know you.",
            message: "You have no connection requests yet.",
        },
        {
            title: "Sent Requests",
            description: "Requests you've sent to other members.",
            message: "You haven't sent any connection requests yet.",
        },
        {
            title: "My Connections",
            description: "Members you've mutually agreed to connect with.",
            message: "Your accepted connections will appear here.",
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

            <h1 style={{ color: "#20364d", marginTop: "24px" }}>
                My Connections
            </h1>

            <p style={{ color: "#64748b", lineHeight: 1.7 }}>
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
                            boxShadow: "0 8px 24px rgba(32, 54, 77, 0.10)",
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
                            {section.message}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}
