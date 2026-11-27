import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import homeStyles from "../page.module.css";
import styles from "./page.module.css";
import { getRequestSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function MembersPage() {
    return (
        <Suspense fallback={<div>Loading members...</div>}>
            <MembersContent />
        </Suspense>
    );
}

async function MembersContent() {
    // Check whether the visitor is signed in
    const { data: session } = await getRequestSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    // Check whether the member has been approved
    const access = await prisma.userAccess.findUnique({
        where: {
            authUserId: session.user.id,
        },
    });

    if (!access || access.status !== "APPROVED") {
        if (access?.status === "BLOCKED") {
            redirect("/blocked");
        }

        redirect("/pending-approval");
    }

    // Retrieve profiles that members have chosen to share
    const approvedProfiles = await prisma.memberProfile.findMany({
        where: {
            shareProfile: true,
            userAccess: {
                status: "APPROVED",
            },
        },
        select: {
            id: true,
            displayName: true,
            location: true,
            occupation: true,
            interests: true,
            storyTitle: true,
            story: true,
            shareStory: true,
            photoUrl: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className={styles.membersPage}>
            <main
                style={{
                    padding: "12px 2% 35px",
                    textAlign: "center",
                }}
            >

                <div className={styles.membersBanner}>
                    <div className={styles.membersBannerInner}>


                        <p
                            style={{
                                color: "#087b83",
                                fontWeight: 700,
                                letterSpacing: "2px",
                                fontSize: "0.75rem",
                                margin: "0 0 6px",
                            }}
                        >
                            FAITH • FRIENDSHIP • CONNECTION
                        </p>

                        <h1
                            style={{
                                color: "#20364d",
                                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                                lineHeight: 1.15,
                                margin: "0 0 8px",
                            }}
                        >
                            Meet Our Members
                        </h1>

                        <h2
                            style={{
                                color: "#087b83",
                                fontSize: "1.15rem",
                                margin: "0 0 8px",
                            }}
                        >
                            Every Story Matters. Every Journey Is Unique.
                        </h2>

                        <p
                            style={{
                                maxWidth: "780px",
                                margin: "0 auto",
                                color: "#475569",
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                            }}
                        >
                            Get to know the people behind our community. Discover their interests,
                            experiences, and the ways faith in Jesus Christ has shaped their lives.
                            Through shared stories, we hope you&apos;ll find inspiration,
                            friendship, and a place where you belong.
                        </p>

                    </div>
                </div>


                <section
                    aria-label="Member stories"
                    className={styles.membersGrid}
                >

                    {approvedProfiles.map((profile) => (
                        <Link
                            key={profile.id}
                            href={`/members/${profile.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "block",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <article
                                style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "18px",
                                padding: "28px",
                                boxShadow: "0 12px 30px rgba(32, 54, 77, 0.18)",
                                borderTop: "6px solid #087b83",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "24px",
                                }}
                            >
                                {profile.photoUrl ? (
                                    <Image
                                        src={`/api/members/photo?memberId=${encodeURIComponent(profile.id)}`}
                                        alt={`Portrait of ${profile.displayName}`}
                                        width={110}
                                        height={110}
                                        unoptimized
                                        style={{
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "4px solid #f28b82",
                                            boxShadow: "0 4px 12px rgba(32, 54, 77, 0.15)",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 110,
                                            height: 110,
                                            borderRadius: "50%",
                                            backgroundColor: "#e6f3f2",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#087b83",
                                            fontSize: "2rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {profile.displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <p
                                style={{
                                    color: "#087b83",
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    fontSize: "0.8rem",
                                }}
                            >
                                MEMBER SPOTLIGHT
                            </p>

                            <h2 style={{ color: "#20364d", marginTop: "12px" }}>
                                {profile.displayName}
                            </h2>

                            <p style={{ color: "#64748b", marginTop: "6px" }}>
                                {[profile.occupation, profile.location]
                                    .filter(Boolean)
                                    .join(" · ")}
                            </p>

                            {profile.shareStory && profile.story && (
                                <>
                                    {profile.storyTitle && (
                                        <h3
                                            style={{
                                                color: "#087b83",
                                                marginTop: "24px",
                                                fontSize: "1.15rem",
                                            }}
                                        >
                                            {profile.storyTitle}
                                        </h3>
                                    )}

                                    <p
                                        style={{
                                            color: "#475569",
                                            lineHeight: 1.7,
                                            marginTop: "14px",
                                        }}
                                    >
                                            {profile.story &&
                                                profile.story.split(/\s+/).length > 30
                                                ? profile.story.split(/\s+/).slice(0, 30).join(" ") + "..."
                                                : profile.story}
                                    </p>
                                </>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    marginTop: "24px",
                                }}
                            >
                                {profile.interests.map((interest) => (
                                    <span
                                        key={interest}
                                        style={{
                                            backgroundColor: "#e6f3f2",
                                            color: "#087b83",
                                            padding: "7px 12px",
                                            borderRadius: "20px",
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                            </article>
                        </Link>
                    ))}

                </section>

            </main>

            <footer className={homeStyles.footer}>
                <h3>Connect & Thrive</h3>
                <p>
                    Building friendships. Creating connections.
                    Strengthening communities.
                </p>
                <p className={homeStyles.copyright}>
                    © 2026 Connect & Thrive. Senior Project.
                </p>
            </footer>
        </div >
    );
}

