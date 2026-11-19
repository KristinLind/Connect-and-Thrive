import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/auth/sign-out-button";
import styles from "@/components/site-header.module.css";

export async function AuthNavigation() {
    const { data: session } = await auth.getSession();

    return session?.user ? (
        <div className={styles.authAction}>
            <SignOutButton />
        </div>
    ) : (
        <Link href="/sign-in" className={styles.authButton}>
            Sign In
        </Link>
    );
}