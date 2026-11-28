import { requireAdminAccess } from "@/lib/auth/access";
import { AccessActions } from "@/components/admin/access-actions";
import { GroupReviewSection } from "@/components/admin/group-review-section";
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

    const pendingAccounts = accounts.filter(
        (account) => account.status === "PENDING",
    );

    const approvedAccounts = accounts.filter(
        (account) => account.status === "APPROVED",
    );

    const blockedAccounts = accounts.filter(
        (account) => account.status === "BLOCKED",
    );

    const orderedAccounts = [
        ...pendingAccounts,
        ...approvedAccounts,
        ...blockedAccounts,
    ];

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
                    CONNECT &amp; THRIVE
                </p>

                <h1
                    style={{
                        color: "#20364d",
                        marginBottom: 10,
                        fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    }}
                >
                    Community Approval Dashboard
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: 30,
                        lineHeight: 1.7,
                    }}
                >
                    Review membership applications, approve
                    member-created groups, and maintain a safe
                    and welcoming Connect &amp; Thrive community.
                </p>

                <nav
                    aria-label="Approval dashboard sections"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        marginBottom: 35,
                    }}
                >
                    <a
                        href="#member-approvals"
                        style={{
                            background: "#087b83",
                            color: "#ffffff",
                            padding: "12px 20px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Member Approvals
                    </a>

                    <a
                        href="#group-approvals"
                        style={{
                            background: "#087b83",
                            color: "#ffffff",
                            padding: "12px 20px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        Group Approvals
                    </a>
                </nav>

                <section
                    id="member-approvals"
                    aria-labelledby="member-approval-heading"
                    style={{
                        scrollMarginTop: 100,
                    }}
                >
                    <h2
                        id="member-approval-heading"
                        style={{
                            color: "#20364d",
                            fontSize: "1.8rem",
                            marginBottom: 10,
                        }}
                    >
                        Member Approvals
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                            lineHeight: 1.7,
                        }}
                    >
                        Review new membership applications
                        and manage existing member access.
                    </p>

                    <div
                        style={{
                            background: "#f0f9f9",
                            padding: "18px 22px",
                            borderRadius: 12,
                            margin: "22px 0",
                            color: "#20364d",
                        }}
                    >
                        <strong>
                            Total Member Accounts: {accounts.length}
                        </strong>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 12,
                            marginBottom: 28,
                        }}
                    >
                        {[
                            {
                                label: "Pending approval",
                                count: pendingAccounts.length,
                                background: "#fef3c7",
                                color: "#92400e",
                            },
                            {
                                label: "Approved members",
                                count: approvedAccounts.length,
                                background: "#dcfce7",
                                color: "#166534",
                            },
                            {
                                label: "Blocked members",
                                count: blockedAccounts.length,
                                background: "#fee2e2",
                                color: "#991b1b",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                style={{
                                    background: item.background,
                                    color: item.color,
                                    padding: 18,
                                    borderRadius: 12,
                                }}
                            >
                                <strong
                                    style={{
                                        display: "block",
                                        fontSize: "1.8rem",
                                    }}
                                >
                                    {item.count}
                                </strong>

                                {item.label}
                            </div>
                        ))}
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
                            {orderedAccounts.map((account) => (
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
                                            <h3
                                                style={{
                                                    color: "#20364d",
                                                    marginTop: 0,
                                                    marginBottom: 8,
                                                    fontSize: "1.3rem",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {account.name}
                                            </h3>

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
                </section>

                <GroupReviewSection />
            </div>
        </main>
    );
}
