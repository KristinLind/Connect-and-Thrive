import Link from "next/link";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function AuthNavigation() {
    const { data: session } = await auth.getSession();

    return session?.user ? (
        <SignOutButton />
    ) : (
        <>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/register">Register</Link>
        </>
    );
}