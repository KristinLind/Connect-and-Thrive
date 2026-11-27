import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";
import NotificationBell from "@/components/auth/notification-bell";
import styles from "@/components/site-header.module.css";
import { connection } from "next/server";

export async function AuthNavigation() {
    // Wait for an actual request before accessing authentication cookies.
    await connection();

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

    const photoSrc = profile?.photoUrl
        ? `/api/members/photo?memberId=${encodeURIComponent(profile.id)}`
        : null;

    return (
        <div className={styles.authAction}>
            <NotificationBell key={session.user.id} />

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
