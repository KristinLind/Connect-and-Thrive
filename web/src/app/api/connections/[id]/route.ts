
import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 }
        );
    }

    const { id } = await params;

    const body = await request.json().catch(() => null);

    if (
        !body ||
        (body.action !== "ACCEPTED" &&
            body.action !== "DECLINED")
    ) {
        return Response.json(
            { error: "Choose Accept or Decline." },
            { status: 400 }
        );
    }

    // Only the recipient can respond to a pending request.
    const result = await prisma.connectionRequest.updateMany({
        where: {
            id,
            recipientId: access.authUserId,
            status: "PENDING",
        },
        data: {
            status: body.action,
        },
    });

    if (result.count === 0) {
        return Response.json(
            {
                error: "Request not found or already answered.",
            },
            { status: 404 }
        );
    }

    return Response.json({
        status: body.action,
        message:
            body.action === "ACCEPTED"
                ? "Connection accepted."
                : "Connection declined.",
    });
}
