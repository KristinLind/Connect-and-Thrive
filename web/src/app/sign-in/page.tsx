import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
    return (
        <main className="auth-page">
            <div className="auth-card">

                <div className="auth-heading">
                    <p className="auth-welcome">WELCOME BACK</p>

                    <h1>Connect &amp; Thrive</h1>

                    <p className="auth-subtitle">
                        Friendship • Activities • Belonging
                    </p>
                </div>

                <div className="auth-tabs">
                    <Link href="/sign-in" className="auth-tab active">
                        Sign In
                    </Link>

                    <Link href="/register" className="auth-tab">
                        Create Account
                    </Link>
                </div>

                <h2>Sign In</h2>

                <p className="auth-subtitle">
                    Sign in to explore activities and connect with others.
                </p>

                <SignInForm />

                <div className="auth-footer">
                    <p>
                        New to Connect &amp; Thrive?{" "}
                        <Link href="/register">
                            Create an account
                        </Link>
                    </p>

                    <Link href="/" className="auth-home-link">
                        ← Back to Home
                    </Link>
                </div>

            </div>
        </main>
    );
}