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
        <main>
            <h1>Account access review</h1>

            {accounts.length === 0 ? (
                <p>No accounts to review.</p>
            ) : (
                <ul>
                    {accounts.map((account) => (
                        <li key={account.authUserId}>
                            <strong>{account.name}</strong> — {account.email} —{" "}
                            {account.status} — {account.createdAt.toLocaleDateString()}{" "}
                            <AccessActions
                                authUserId={account.authUserId}
                                status={account.status}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}