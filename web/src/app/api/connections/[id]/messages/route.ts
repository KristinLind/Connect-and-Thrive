import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

async function authorizeConversation(
    connectionId: string,
    authUserId: string
) {
    const connection = await prisma.connectionRequest.findFirst({
        where: {
            id: connectionId,
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
    });

    return connection;
}

// Retrieve messages for an accepted connection.
export async function GET(
    _request: Request,
    { params }: RouteContext
) {
    try {
        const { response, access } = await getApprovedApiAccess();

        if (response) return response;

        if (!access) {
            return Response.json(
                { error: "Approved access required." },
                { status: 403 }
            );
        }

        const { id } = await params;

        const connection = await authorizeConversation(
            id,
            access.authUserId
        );

        if (!connection) {
            return Response.json(
                { error: "Conversation unavailable or messaging disabled." },
                { status: 403 }
            );
        }

        const messages = await prisma.connectionMessage.findMany({
            where: { connectionId: connection.id },
            orderBy: [
                { createdAt: "asc" },
                { id: "asc" },
            ],
            take: 100,
        });

        return Response.json({ messages });
    } catch (error) {
        console.error("Unable to load messages:", error);

        return Response.json(
            { error: "Unable to load messages." },
            { status: 500 }
        );
    }
}

// Send a new private message.
export async function POST(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { response, access } = await getApprovedApiAccess();

        if (response) return response;

        if (!access) {
            return Response.json(
                { error: "Approved access required." },
                { status: 403 }
            );
        }

        const { id } = await params;

        const connection = await authorizeConversation(
            id,
            access.authUserId
        );

        if (!connection) {
            return Response.json(
                { error: "Conversation unavailable or messaging disabled." },
                { status: 403 }
            );
        }

        const body = await request.json().catch(() => null);

        if (!body || typeof body.content !== "string") {
            return Response.json(
                { error: "Message text is required." },
                { status: 400 }
            );
        }

        const content = body.content.trim();

        if (content.length === 0 || content.length > 2000) {
            return Response.json(
                { error: "Messages must contain 1–2000 characters." },
                { status: 400 }
            );
        }

        const message = await prisma.connectionMessage.create({
            data: {
                connectionId: connection.id,
                senderId: access.authUserId,
                content,
            },
        });

        return Response.json(
            { message },
            { status: 201 }
        );
    } catch (error) {
        console.error("Unable to send message:", error);

        return Response.json(
            { error: "Unable to send message." },
            { status: 500 }
        );
    }
}


// Mark incoming messages as read.
export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { response, access } = await getApprovedApiAccess();

        if (response) return response;

        if (!access) {
            return Response.json(
                { error: "Approved access required." },
                { status: 403 }
            );
        }

        const { id } = await params;

        const connection = await authorizeConversation(
            id,
            access.authUserId
        );

        if (!connection) {
            return Response.json(
                {
                    error:
                        "Conversation unavailable or messaging disabled.",
                },
                { status: 403 }
            );
        }

        const body = await request.json().catch(() => null);

        if (
            !Array.isArray(body?.messageIds) ||
            body.messageIds.length > 100 ||
            !body.messageIds.every(
                (id: unknown) => typeof id === "string"
            )
        ) {
            return Response.json(
                { error: "Invalid message IDs." },
                { status: 400 }
            );
        }

        const result = await prisma.connectionMessage.updateMany({
            where: {
                id: {
                    in: body.messageIds,
                },
                connectionId: connection.id,
                senderId: {
                    not: access.authUserId,
                },
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });

        return Response.json({
            success: true,
            markedAsRead: result.count,
        });
    } catch (error) {
        console.error("Unable to mark messages as read:", error);

        return Response.json(
            { error: "Unable to mark messages as read." },
            { status: 500 }
        );
    }
}

