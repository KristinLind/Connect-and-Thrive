import { requireAdminAccess } from "@/lib/auth/access";
import { AccessActions } from "@/components/admin/access-actions";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function AdminReviewPage() {
    await requireAdminAccess();

    const accounts = await prisma.userAccess.findMany({
        where: { isAdmin: false },
        orderBy: { createdAt: "desc" },
        select: {
            authUserId: true,
            email: true,
            name: true,
            status: true,
            createdAt: true,
        },
    });

    return (
        <main
            style={{
                minHeight: "75vh",
                background: "#f8fafc",
                padding: "45px 20px",
                boxSizing: "border-box",
                width: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "950px",
                    width: "100%",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "35px",
                    borderRadius: "18px",
                    borderTop: "6px solid #087b83",
                    boxShadow: "0 12px 30px rgba(32,54,77,0.12)",
                    boxSizing: "border-box",
                }}
            >
                <p
                    style={{
                        color: "#087b83",
                        fontWeight: 700,
                        letterSpacing: "2px",
                        fontSize: "0.8rem",
                    }}
                >
                    CONNECT & THRIVE
                </p>

                <h1
                    style={{
                        color: "#20364d",
                        marginBottom: 10,
                        fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    }}
                >
                    Member Approval Dashboard
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: 30,
                        lineHeight: 1.7,
                    }}
                >
                    Review membership applications and manage
                    access to the Connect & Thrive community.
                </p>

                <div
                    style={{
                        background: "#f0f9f9",
                        padding: "18px 22px",
                        borderRadius: 12,
                        marginBottom: 28,
                        color: "#20364d",
                    }}
                >
                    <strong>Total Member Accounts: {accounts.length}</strong>

                    <p style={{ marginBottom: 0 }}>
                        Pending Approval:{" "}
                        {
                            accounts.filter(
                                (account) =>
                                    account.status === "PENDING"
                            ).length
                        }
                    </p>
                </div>

                {accounts.length === 0 ? (
                    <p style={{ color: "#64748b" }}>
                        No accounts to review.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gap: 18,
                        }}
                    >
                        {accounts.map((account) => (
                            <article
                                key={account.authUserId}
                                style={{
                                    border: "1px solid #dbe5e7",
                                    borderRadius: 12,
                                    padding: 22,
                                    background: "#ffffff",
                                    minWidth: 0,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        flexWrap: "wrap",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: "1 1 240px",
                                            minWidth: 0,
                                        }}
                                    >
                                        <h2
                                            style={{
                                                color: "#20364d",
                                                marginTop: 0,
                                                marginBottom: 8,
                                                fontSize: "1.3rem",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {account.name}
                                        </h2>

                                        <p
                                            style={{
                                                color: "#64748b",
                                                margin: "5px 0",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {account.email}
                                        </p>

                                        <p
                                            style={{
                                                color: "#64748b",
                                                margin: "5px 0",
                                            }}
                                        >
                                            Registered:{" "}
                                            {account.createdAt.toLocaleDateString()}
                                        </p>

                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginTop: 12,
                                                padding: "7px 14px",
                                                borderRadius: 20,
                                                fontSize: "0.85rem",
                                                fontWeight: 700,
                                                background:
                                                    account.status === "APPROVED"
                                                        ? "#dcfce7"
                                                        : account.status === "PENDING"
                                                            ? "#fef3c7"
                                                            : "#fee2e2",
                                                color:
                                                    account.status === "APPROVED"
                                                        ? "#166534"
                                                        : account.status === "PENDING"
                                                            ? "#92400e"
                                                            : "#991b1b",
                                            }}
                                        >
                                            {account.status === "APPROVED"
                                                ? "Approved"
                                                : account.status === "PENDING"
                                                    ? "Pending Approval"
                                                    : "Blocked"}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                            gap: 10,
                                        }}
                                    >
                                        <AccessActions
                                            authUserId={account.authUserId}
                                            status={account.status}
                                        />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
