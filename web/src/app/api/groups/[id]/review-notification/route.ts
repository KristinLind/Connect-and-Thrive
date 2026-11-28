import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { response, access } =
        await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 },
        );
    }

    const { id } = await params;

    const body = await request.json().catch(() => null);

    if (
        !body ||
        typeof body.reviewedAt !== "string"
    ) {
        return Response.json(
            { error: "Invalid notification request." },
            { status: 400 },
        );
    }

    const reviewedAt = new Date(body.reviewedAt);

    if (Number.isNaN(reviewedAt.getTime())) {
        return Response.json(
            { error: "Invalid review timestamp." },
            { status: 400 },
        );
    }

    const updated = await prisma.group.updateMany({
        where: {
            id,
            createdById: access.authUserId,
            status: {
                in: ["APPROVED", "REJECTED"],
            },
            reviewedAt,
            reviewNotificationReadAt: null,
        },
        data: {
            reviewNotificationReadAt: new Date(),
        },
    });

    if (updated.count !== 1) {
        return Response.json(
            {
                error:
                    "Notification is unavailable or has already been read.",
            },
            { status: 409 },
        );
    }

    return Response.json(
        {
            success: true,
            message: "Notification marked as read.",
        },
        {
            headers: {
                "Cache-Control": "private, no-store",
            },
        },
    );
}
