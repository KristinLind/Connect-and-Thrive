import Link from "next/link";

export default function PendingApprovalPage() {
    return (
        <main
            style={{
                minHeight: "70vh",
                background: "#f8fafc",
                padding: "12px 2% 35px",
            }}
        >
            <div
                style={{
                    maxWidth: 650,
                    margin: "0 auto",
                    padding: "40px",
                    background: "#ffffff",
                    borderRadius: 18,
                    borderTop: "6px solid #087b83",
                    boxShadow: "0 12px 30px rgba(32,54,77,0.12)",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        color: "#087b83",
                        fontWeight: 700,
                        letterSpacing: 2,
                        fontSize: 13,
                    }}
                >
                    CONNECT & THRIVE
                </p>

                <h1 style={{ color: "#20364d" }}>
                    Your Application Is Pending
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        lineHeight: 1.8,
                        fontSize: 17,
                    }}
                >
                    Thank you for your interest in joining
                    Connect & Thrive!
                </p>

                <p
                    style={{
                        color: "#64748b",
                        lineHeight: 1.8,
                    }}
                >
                    Your account is awaiting administrator approval.
                    Once approved, you will be able to explore
                    member profiles, read stories and testimonies,
                    and participate in community activities.
                </p>

                <div
                    style={{
                        background: "#f0f9f9",
                        padding: 20,
                        borderRadius: 12,
                        marginTop: 25,
                        marginBottom: 25,
                    }}
                >
                    <p style={{ color: "#20364d", margin: 0 }}>
                        Want to update your application or finish
                        adding your photograph?
                    </p>

                    <Link
                        href="/profile/create"
                        style={{
                            display: "inline-block",
                            marginTop: 15,
                            background: "#087b83",
                            color: "#ffffff",
                            padding: "12px 22px",
                            borderRadius: 9,
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        Edit My Application
                    </Link>
                </div>

                <Link
                    href="/"
                    style={{
                        color: "#087b83",
                        fontWeight: 600,
                    }}
                >
                    Return to Home
                </Link>
            </div>
        </main>
    );
}
