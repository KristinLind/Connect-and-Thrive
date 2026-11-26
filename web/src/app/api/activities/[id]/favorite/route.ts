import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// Save an activity for the current member.
export async function POST(
    _request: Request,
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

    const activity = await prisma.activity.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!activity) {
        return Response.json(
            { error: "Activity not found." },
            { status: 404 }
        );
    }

    await prisma.favorite.upsert({
        where: {
            userId_activityId: {
                userId: access.authUserId,
                activityId: id,
            },
        },
        update: {},
        create: {
            userId: access.authUserId,
            activityId: id,
        },
    });

    return Response.json({ saved: true });
}

// Remove an activity from the current member's saved list.
export async function DELETE(
    _request: Request,
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

    await prisma.favorite.deleteMany({
        where: {
            userId: access.authUserId,
            activityId: id,
        },
    });

    return Response.json({ saved: false });
}