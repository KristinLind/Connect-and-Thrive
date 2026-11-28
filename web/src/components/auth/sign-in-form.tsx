"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { getPostLoginDestination } from "@/lib/auth/api-access-policy";

export function SignInForm() {
    const router = useRouter();

    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Fill in the demo email address.
    // Never expose a demo password through NEXT_PUBLIC_ variables.
    function useDemoAccount() {
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";

        if (!demoEmail) {
            setError("Demo account is not configured yet.");
            return;
        }

        setError("");
        setEmail(demoEmail);
        setPassword("");
        setShowPassword(false);
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

            let hasProfile = false;
            if (access.status === "PENDING") {
                const profileResponse = await fetch("/api/profile", {
                    cache: "no-store",
                });

                if (!profileResponse.ok) {
                    setError("Unable to check your application. Please try again.");
                    return;
                }

                const data = await profileResponse.json();

                hasProfile = Boolean(data.profile);
            }

            const destination = getPostLoginDestination({
                status: access.status,
                isAdmin: access.isAdmin,
                hasProfile,
            });

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

            {/* Password with Show/Hide Eye */}
            <div className="auth-form-field">
                <label htmlFor="signin-password">
                    Password
                </label>

                <div
                    style={{
                        position: "relative",
                        width: "100%",
                    }}
                >
                    <input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        disabled={pending}
                        required
                        style={{
                            width: "100%",
                            paddingRight: "3.5rem",
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        disabled={pending}
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        aria-pressed={showPassword}
                        title={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        style={{
                            position: "absolute",
                            right: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "transparent",
                            color: "#24564f",
                            cursor: pending ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.35rem",
                        }}
                    >
                        {showPassword ? (
                            // Eye with a slash: hide password
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M3 3l18 18" />
                                <path d="M10.6 5.1A11 11 0 0 1 12 5c5 0 9.3 3.1 11 7a12.5 12.5 0 0 1-4.1 5.2" />
                                <path d="M6.2 6.2A12.4 12.4 0 0 0 1 12c1.7 3.9 6 7 11 7a11 11 0 0 0 5.8-1.6" />
                                <path d="M10 10a3 3 0 0 0 4 4" />
                            </svg>
                        ) : (
                            // Open eye: show password
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
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
