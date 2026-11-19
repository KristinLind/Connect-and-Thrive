"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignInForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") ?? "").trim();
        const password = String(form.get("password") ?? "");

        if (!email || !password) {
            setError("Enter your email and password.");
            return;
        }

        setPending(true);

        try {
            const result = await authClient.signIn.email({ email, password });

            if (result.error) {
                setError(result.error.message || "Could not sign in.");
                return;
            }

            const response = await fetch("/api/account/access", { method: "POST" });

            if (response.status === 401) {
                router.replace("/sign-in?registered=1");
                return;
            }

            if (!response.ok) {
                setError("Your account was created, but access could not be initialized.");
                return;
            }

            const access = (await response.json()) as {
                status: "PENDING" | "APPROVED" | "BLOCKED";
                isAdmin: boolean;
            };

            const destination =
                access.status === "PENDING"
                    ? "/pending-approval"
                    : access.status === "BLOCKED"
                        ? "/blocked"
                        : access.isAdmin
                            ? "/admin/review"
                            : "/";

            router.replace(destination);
            router.refresh();
        } catch {
            setError("Could not connect to authentication. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="signin-email">Email</label>
            <input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
            />

            <label htmlFor="signin-password">Password</label>
            <input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
            />

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}