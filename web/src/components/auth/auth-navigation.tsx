import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";
import styles from "@/components/site-header.module.css";

export async function AuthNavigation() {
    const { data: session } = await auth.getSession();

    // Visitors who are not signed in
    if (!session?.user) {
        return (
            <Link href="/sign-in" className={styles.authButton}>
                Sign In
            </Link>
        );
    }

    // Retrieve the signed-in member's profile
    const profile = await prisma.memberProfile.findUnique({
        where: {
            authUserId: session.user.id,
        },
        select: {
            id: true,
            displayName: true,
            photoUrl: true,
        },
    });

    // Count pending invitations received by this member
    const pendingRequestCount =
        await prisma.connectionRequest.count({
            where: {
                recipientId: session.user.id,
                status: "PENDING",
            },
        });

    // Count unread incoming private messages
    const unreadMessageCount =
        await prisma.connectionMessage.count({
            where: {
                readAt: null,
                senderId: {
                    not: session.user.id,
                },
                connection: {
                    status: "ACCEPTED",
                    OR: [
                        { senderId: session.user.id },
                        { recipientId: session.user.id },
                    ],
                },
            },
        });

    // Combined notification count
    const totalNotificationCount =
        pendingRequestCount + unreadMessageCount;

    const displayName =
        profile?.displayName || session.user.name || "Member";

    const initial = displayName.charAt(0).toUpperCase();

    const photoSrc = profile?.photoUrl
        ? `/api/members/photo?memberId=${encodeURIComponent(profile.id)}`
        : null;

    return (
        <div className={styles.authAction}>
            {/* NOTIFICATION BELL */}
            <details
                className={styles.notificationMenu}
                style={{ position: "relative" }}
            >
                <summary
                    className={styles.notificationButton}
                    style={{ position: "relative" }}
                    aria-label={
                        totalNotificationCount > 0
                            ? `Notifications: ${totalNotificationCount} new notifications`
                            : "Open member notifications"
                    }
                    title={
                        totalNotificationCount > 0
                            ? `${totalNotificationCount} new notifications`
                            : "Notifications"
                    }
                >
                    <svg
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                        <path d="M10 21h4" />
                    </svg>

                    {/* Coral badge remains visible when menu is closed */}
                    {totalNotificationCount > 0 && (
                        <span
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "-7px",
                                right: "-7px",
                                backgroundColor: "#ff7467",
                                color: "#ffffff",
                                borderRadius: "999px",
                                minWidth: "19px",
                                height: "19px",
                                padding: "0 4px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                                boxSizing: "border-box",
                            }}
                        >
                            {totalNotificationCount}
                        </span>
                    )}
                </summary>

                <div className={styles.notificationDropdown}>
                    <h3 className={styles.notificationHeading}>
                        Notifications
                    </h3>

                    {/* Highlight pending connection requests */}
                    <Link
                        href="/connections"
                        style={
                            pendingRequestCount > 0
                                ? {
                                    backgroundColor: "#fff0ed",
                                    color: "#b94437",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                }
                                : undefined
                        }
                    >
                        Connection Requests
                        {pendingRequestCount > 0 &&
                            ` (${pendingRequestCount} new)`}
                    </Link>

                    {/* Highlight unread private messages */}
                    <Link
                        href="/connections"
                        style={
                            unreadMessageCount > 0
                                ? {
                                    backgroundColor: "#fff0ed",
                                    color: "#b94437",
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                }
                                : undefined
                        }
                    >
                        Unread Messages
                        {unreadMessageCount > 0 &&
                            ` (${unreadMessageCount} new)`}
                    </Link>

                    <Link href="/saved-activities">
                        Saved Activities
                    </Link>

                    <Link href="/my-groups">
                        My Groups
                    </Link>

                    <div className={styles.notificationComingSoon}>
                        Registered Activities
                        <span>Coming Soon</span>
                    </div>
                </div>
            </details>

            {/* ACCOUNT MENU */}
            <details className={styles.accountMenu}>
                <summary
                    className={styles.accountToggle}
                    aria-label="Open account menu"
                >
                    <span className={styles.accountAvatar}>
                        {photoSrc ? (
                            <Image
                                src={photoSrc}
                                alt=""
                                width={42}
                                height={42}
                                unoptimized
                                className={styles.accountAvatarImage}
                            />
                        ) : (
                            <span className={styles.accountInitial}>
                                {initial}
                            </span>
                        )}
                    </span>

                    <span>Account</span>
                </summary>

                <div className={styles.accountDropdown}>
                    <Link href="/profile/create">
                        My Profile
                    </Link>

                    <Link href="/connections">
                        My Connections
                    </Link>

                    <Link href="/saved-activities">
                        My Saved Activities
                    </Link>

                    <Link href="/my-groups">
                        My Groups
                    </Link>

                    <SignOutButton />
                </div>
            </details>
        </div>
    );
}

