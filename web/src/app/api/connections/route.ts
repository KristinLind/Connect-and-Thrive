
import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 }
        );
    }

    const body = await request.json().catch(() => null);

    if (
        !body ||
        typeof body.recipientId !== "string" ||
        !body.recipientId.trim()
    ) {
        return Response.json(
            { error: "A valid recipient is required." },
            { status: 400 }
        );
    }

    // recipientId is the member's UserAccess authUserId.
    const recipientId = body.recipientId.trim();
    const senderId = access.authUserId;

    if (senderId === recipientId) {
        return Response.json(
            { error: "You cannot connect with yourself." },
            { status: 400 }
        );
    }

    // Check the recipient's approval and privacy preferences.
    const recipient = await prisma.memberProfile.findFirst({
        where: {
            authUserId: recipientId,
            shareProfile: true,
            allowMessages: true,
            userAccess: {
                status: "APPROVED",
            },
        },
    });

    if (!recipient) {
        return Response.json(
            { error: "This member is not accepting connection requests." },
            { status: 403 }
        );
    }

    // Check for a previous invitation in either direction.
    const existing = await prisma.connectionRequest.findFirst({
        where: {
            OR: [
                { senderId, recipientId },
                {
                    senderId: recipientId,
                    recipientId: senderId,
                },
            ],
        },
    });

    if (existing) {
        return Response.json(
            { error: "A connection request already exists between these members." },
            { status: 409 }
        );
    }

    try {
        const connection = await prisma.connectionRequest.create({
            data: {
                senderId,
                recipientId,
                status: "PENDING",
            },
        });

        return Response.json(
            {
                message: "Connection request sent successfully.",
                connection: {
                    id: connection.id,
                    status: connection.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create connection request:", error);

        return Response.json(
            { error: "Unable to send the connection request." },
            { status: 500 }
        );
    }
}
