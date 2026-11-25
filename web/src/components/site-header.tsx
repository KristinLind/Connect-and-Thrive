import Link from "next/link";
import { Suspense } from "react";
import { AuthNavigation } from "@/components/auth/auth-navigation";
import styles from "./site-header.module.css";

export function SiteHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.topRow}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        Connect <span>&amp;</span> Thrive
                    </Link>

                    <p className={styles.tagline}>
                        Friendship • Activities • Belonging
                    </p>
                </div>

                <Suspense fallback={null}>
                    <AuthNavigation />
                </Suspense>
            </div>

            <nav className={styles.nav} aria-label="Main navigation">
                <Link href="/">Home</Link>
                <Link href="/activities">Explore Activities</Link>
                <Link href="/activities/events">Community Events</Link>
                <Link href="/members">Meet Our Members</Link>
                <Link href="/stories">Stories</Link>
                <Link href="/about">About Us</Link>
            </nav>
        </header>
    );
}
