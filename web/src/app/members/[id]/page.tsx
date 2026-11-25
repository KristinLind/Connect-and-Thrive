import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function MemberDetailPage({ params }: PageProps) {
    return (
        <Suspense
            fallback={
                <main style={{ padding: "40px" }}>
                    Loading member profile...
                </main>
            }
        >
            <MemberDetailContent params={params} />
        </Suspense>
    );
}

async function MemberDetailContent({ params }: PageProps) {
    // Only approved members can view the member directory.
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const access = await prisma.userAccess.findUnique({
        where: {
            authUserId: session.user.id,
        },
    });

    if (access?.status === "BLOCKED") {
        redirect("/blocked");
    }

    if (access?.status !== "APPROVED") {
        redirect("/pending-approval");
    }

    const { id } = await params;

    // Retrieve the member directly from Neon PostgreSQL.
    // Only approved members who share their profiles are visible.
    const profile = await prisma.memberProfile.findFirst({
        where: {
            id,
            shareProfile: true,
            userAccess: {
                status: "APPROVED",
            },
        },
    });

    if (!profile) {
        notFound();
    }

    const name = profile.displayName;
    const occupation = profile.occupation;
    const location = profile.location;
    const interests = profile.interests;

    // Respect the member's story privacy preference.
    const title = profile.shareStory ? profile.storyTitle : null;
    const story = profile.shareStory ? profile.story : null;

    const image = profile.photoUrl
        ? `/api/members/photo?memberId=${encodeURIComponent(profile.id)}`
        : null;

    return (
        <main
            style={{
                maxWidth: "1400px",
                margin: "40px auto",
                padding: "30px",
            }}
        >
            <Link
                href="/members"
                style={{
                    color: "#087b83",
                    textDecoration: "none",
                    fontWeight: 600,
                }}
            >
                ← Back to Members
            </Link>

            <article
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    padding: "36px",
                    marginTop: "24px",
                    boxShadow: "0 12px 30px rgba(32, 54, 77, 0.18)",
                    borderTop: "6px solid #087b83",
                }}
            >
                {image ? (
                    <div style={{ textAlign: "center" }}>
                        <Image
                            src={image}
                            alt={`Portrait of ${name}`}
                            width={140}
                            height={140}
                            unoptimized
                            style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "4px solid #f28b82",
                            }}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            backgroundColor: "#e6f3f2",
                            color: "#087b83",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                            fontWeight: 700,
                            margin: "0 auto",
                        }}
                    >
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}

                <h1
                    style={{
                        color: "#20364d",
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >
                    {name}
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        textAlign: "center",
                    }}
                >
                    {[occupation, location]
                        .filter(Boolean)
                        .join(" · ")}
                </p>

                {title && (
                    <h2
                        style={{
                            color: "#087b83",
                            marginTop: "32px",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {story && (
                    <p
                        style={{
                            color: "#475569",
                            lineHeight: 1.9,
                            marginTop: "16px",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {story}
                    </p>
                )}

                <h3
                    style={{
                        color: "#20364d",
                        marginTop: "32px",
                    }}
                >
                    Interests
                </h3>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "12px",
                    }}
                >
                    {interests.map((interest) => (
                        <span
                            key={interest}
                            style={{
                                backgroundColor: "#e6f3f2",
                                color: "#087b83",
                                padding: "8px 14px",
                                borderRadius: "20px",
                            }}
                        >
                            {interest}
                        </span>
                    ))}
                </div>
            </article>
        </main>
    );
}
