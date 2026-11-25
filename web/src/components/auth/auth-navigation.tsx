
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";
import styles from "@/components/site-header.module.css";

export async function AuthNavigation() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return (
            <Link href="/sign-in" className={styles.authButton}>
                Sign In
            </Link>
        );
    }

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

    const displayName =
        profile?.displayName || session.user.name || "Member";

    const initial = displayName.charAt(0).toUpperCase();

    const photoSrc =
        profile?.photoUrl
            ? `/api/members/photo?memberId=${encodeURIComponent(profile.id)}`
            : null;

    return (
        <div className={styles.authAction}>
            <Link
                href="/connections"
                className={styles.notificationButton}
                aria-label="View connection requests"
                title="Connection requests"
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
            </Link>

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
                    <Link href="/mygroups">
                        My Groups
                    </Link>
                    <SignOutButton />
                </div>
            </details>
        </div>
    );
}

