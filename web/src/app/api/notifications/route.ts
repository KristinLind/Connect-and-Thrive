import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export async function GET() {
    await connection();

    try {
        const { response, access } = await getApprovedApiAccess();

        if (response) return response;

        if (!access) {
            return Response.json(
                { error: "Approved access required." },
                { status: 403 }
            );
        }

        const authUserId = access.authUserId;
        const isAdmin = access.isAdmin;

        const [
            pendingRequestCount,
            unreadMessageCount,
            registeredActivityCount,
            pendingMemberApprovalCount,
            pendingGroupApprovalCount,
            unreadGroupReviewCount,
        ] = await Promise.all([
            prisma.connectionRequest.count({
                where: {
                    recipientId: authUserId,
                    status: "PENDING",
                },
            }),

            prisma.connectionMessage.count({
                where: {
                    readAt: null,
                    senderId: {
                        not: authUserId,
                    },
                    connection: {
                        status: "ACCEPTED",
                        OR: [
                            { senderId: authUserId },
                            { recipientId: authUserId },
                        ],
                        sender: {
                            status: "APPROVED",
                            profile: {
                                is: { allowMessages: true },
                            },
                        },
                        recipient: {
                            status: "APPROVED",
                            profile: {
                                is: { allowMessages: true },
                            },
                        },
                    },
                },
            }),

            prisma.rSVP.count({
                where: {
                    userId: authUserId,
                    activity: {
                        date: {
                            gte: new Date(),
                        },
                    },
                },
            }),

            isAdmin
                ? prisma.userAccess.count({
                    where: {
                        status: "PENDING",
                        isAdmin: false,
                    },
                })
                : Promise.resolve(0),

            isAdmin
                ? prisma.group.count({
                    where: {
                        status: "PENDING",
                    },
                })
                : Promise.resolve(0),

            prisma.group.count({
                where: {
                    createdById: authUserId,
                    status: {
                        in: ["APPROVED", "REJECTED"],
                    },
                    reviewedAt: {
                        not: null,
                    },
                    reviewNotificationReadAt: null,
                },
            }),
        ]);

        return Response.json(
            {
                isAdmin,
                pendingRequestCount,
                unreadMessageCount,
                registeredActivityCount,
                pendingMemberApprovalCount,
                pendingGroupApprovalCount,
                unreadGroupReviewCount,
                totalNotificationCount:
                    pendingRequestCount +
                    unreadMessageCount +
                    registeredActivityCount +
                    pendingMemberApprovalCount +
                    pendingGroupApprovalCount +
                    unreadGroupReviewCount,
            },
            {
                headers: {
                    "Cache-Control": "private, no-store",
                },
            }
        );
    } catch (error) {
        console.error("Unable to load notifications:", error);

        return Response.json(
            { error: "Unable to load notifications." },
            { status: 500 }
        );
    }
}
