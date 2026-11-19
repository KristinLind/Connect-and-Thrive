"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignInForm() {
    const router = useRouter();

    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Fill in the dedicated demo account credentials.
    function useDemoAccount() {
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

        if (!demoEmail || !demoPassword) {
            setError("Demo account is not configured yet.");
            return;
        }

        setError("");
        setEmail(demoEmail);
        setPassword(demoPassword);
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const signInEmail = email.trim();
        const signInPassword = password;

        if (!signInEmail || !signInPassword) {
            setError("Enter your email and password.");
            return;
        }

        setPending(true);

        try {
            const result = await authClient.signIn.email({
                email: signInEmail,
                password: signInPassword,
            });

            if (result.error) {
                setError(result.error.message || "Could not sign in.");
                return;
            }

            const response = await fetch("/api/account/access", {
                method: "POST",
            });

            if (response.status === 401) {
                router.replace("/sign-in?registered=1");
                return;
            }

            if (!response.ok) {
                setError(
                    "Your account was created, but access could not be initialized."
                );
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
            setError(
                "Could not connect to authentication. Please try again."
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="auth-signin-form"
        >
            {/* Demo Account */}
            <div className="auth-demo">
                <div>
                    <h3>Demo Account</h3>
                    <p>
                        Explore Connect &amp; Thrive as a test member.
                    </p>
                </div>

                <button
                    type="button"
                    className="auth-demo-button"
                    onClick={useDemoAccount}
                    disabled={pending}
                >
                    Use Demo
                </button>
            </div>

            {/* Email Address */}
            <div className="auth-form-field">
                <label htmlFor="signin-email">
                    Email Address
                </label>

                <input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={pending}
                    required
                />
            </div>

            {/* Password */}
            <div className="auth-form-field">
                <label htmlFor="signin-password">
                    Password
                </label>

                <input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={pending}
                    required
                />
            </div>

            {/* Error Message */}
            {error && (
                <p role="alert" className="auth-form-error">
                    {error}
                </p>
            )}

            {/* Sign In Button */}
            <button
                type="submit"
                className="auth-submit-button"
                disabled={pending}
            >
                {pending ? "Signing in…" : "Sign In"}
            </button>
        </form>
    );
}
