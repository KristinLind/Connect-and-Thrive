"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        const password = String(form.get("password") ?? "");
        const confirmPassword = String(form.get("confirmPassword") ?? "");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please complete every field.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setPending(true);

        try {
            const result = await authClient.signUp.email({ name, email, password });

            if (result.error) {
                setError(result.error.message || "Could not create your account.");
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
            <label htmlFor="register-name">Name</label>
            <input id="register-name" name="name" autoComplete="name" required />

            <label htmlFor="register-email">Email</label>
            <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
            />

            <label htmlFor="register-password">Password</label>
            <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
            />

            <label htmlFor="register-confirm-password">Confirm password</label>
            <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
            />

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={pending}>
                {pending ? "Creating account…" : "Create account"}
            </button>
        </form>
    );
}