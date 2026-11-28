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

        const [
            pendingRequestCount,
            unreadMessageCount,
            registeredActivityCount,
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
        ]);

        return Response.json(
            {
                pendingRequestCount,
                unreadMessageCount,
                registeredActivityCount,
                totalNotificationCount:
                    pendingRequestCount +
                    unreadMessageCount +
                    registeredActivityCount,
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
