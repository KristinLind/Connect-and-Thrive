import { requireAdminAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import { GroupApprovalActions } from "./group-approval-actions";

export async function GroupReviewSection() {
    await requireAdminAccess();

    const groups = await prisma.group.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            creator: {
                select: {
                    name: true,
                    email: true,
                    profile: {
                        select: {
                            displayName: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    memberships: true,
                },
            },
        },
    });

    const pendingGroups = groups.filter(
        (group) => group.status === "PENDING",
    );

    const approvedGroups = groups.filter(
        (group) => group.status === "APPROVED",
    );

    const rejectedGroups = groups.filter(
        (group) => group.status === "REJECTED",
    );

    const orderedGroups = [
        ...pendingGroups,
        ...approvedGroups,
        ...rejectedGroups,
    ];

    return (
        <section
            id="group-approvals"
            aria-labelledby="group-approval-heading"
            style={{
                marginTop: 40,
                paddingTop: 30,
                borderTop: "2px solid #dbe5e7",
            }}
        >
            <h2
                id="group-approval-heading"
                style={{
                    color: "#20364d",
                    fontSize: "1.8rem",
                    marginBottom: 10,
                }}
            >
                Group Approvals
            </h2>

            <p
                style={{
                    color: "#64748b",
                    lineHeight: 1.7,
                }}
            >
                Review member-created groups before they
                become available to the Connect &amp; Thrive
                community.
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 12,
                    margin: "22px 0",
                }}
            >
                {[
                    {
                        label: "Pending approval",
                        count: pendingGroups.length,
                        background: "#fef3c7",
                        color: "#92400e",
                    },
                    {
                        label: "Approved groups",
                        count: approvedGroups.length,
                        background: "#dcfce7",
                        color: "#166534",
                    },
                    {
                        label: "Rejected groups",
                        count: rejectedGroups.length,
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
                                fontSize: "1.8rem",
                                display: "block",
                            }}
                        >
                            {item.count}
                        </strong>

                        {item.label}
                    </div>
                ))}
            </div>

            {pendingGroups.length === 0 && (
                <p
                    style={{
                        background: "#f0f9f9",
                        color: "#087b83",
                        padding: 16,
                        borderRadius: 10,
                    }}
                >
                    No group submissions are currently
                    awaiting approval.
                </p>
            )}

            <div
                style={{
                    display: "grid",
                    gap: 18,
                    marginTop: 22,
                }}
            >
                {orderedGroups.map((group) => (
                    <article
                        key={group.id}
                        style={{
                            border: "1px solid #dbe5e7",
                            borderRadius: 12,
                            padding: 22,
                            background: "#ffffff",
                            overflowWrap: "anywhere",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: 12,
                            }}
                        >
                            <h3
                                style={{
                                    color: "#20364d",
                                    margin: 0,
                                    fontSize: "1.3rem",
                                }}
                            >
                                {group.name}
                            </h3>

                            <span
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 20,
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    background:
                                        group.status === "APPROVED"
                                            ? "#dcfce7"
                                            : group.status === "PENDING"
                                                ? "#fef3c7"
                                                : "#fee2e2",
                                    color:
                                        group.status === "APPROVED"
                                            ? "#166534"
                                            : group.status === "PENDING"
                                                ? "#92400e"
                                                : "#991b1b",
                                }}
                            >
                                {group.status === "APPROVED"
                                    ? "Approved"
                                    : group.status === "PENDING"
                                        ? "Pending approval"
                                        : "Rejected"}
                            </span>
                        </div>

                        <p
                            style={{
                                color: "#64748b",
                                fontSize: "0.9rem",
                            }}
                        >
                            Submitted by:{" "}
                            {group.creator?.profile?.displayName ??
                                group.creator?.name ??
                                "Creator not recorded"}
                        </p>

                        {group.creator?.email && (
                            <p
                                style={{
                                    color: "#64748b",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {group.creator.email}
                            </p>
                        )}

                        <p
                            style={{
                                color: "#20364d",
                                lineHeight: 1.7,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {group.description}
                        </p>

                        <p>
                            <strong>Meeting schedule:</strong>{" "}
                            {group.meetingSchedule}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {group.location}
                        </p>

                        <p>
                            <strong>Members:</strong>{" "}
                            {group._count.memberships}
                        </p>

                        <p
                            style={{
                                color: "#64748b",
                                fontSize: "0.85rem",
                            }}
                        >
                            Submitted:{" "}
                            {group.createdAt.toLocaleDateString()}
                        </p>

                        <GroupApprovalActions
                            key={`${group.id}-${group.updatedAt.toISOString()}`}
                            groupId={group.id}
                            status={group.status}
                            updatedAt={group.updatedAt.toISOString()}
                            reviewFeedback={group.reviewFeedback}
                            hasCreator={group.createdById !== null}
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}
