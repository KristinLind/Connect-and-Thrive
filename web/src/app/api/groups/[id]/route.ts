import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";
import { parseGroupInput } from "@/lib/groups/group-input";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 },
        );
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const input = parseGroupInput(body);

    if (!input) {
        return Response.json(
            {
                error: "Provide a valid name, description, meeting schedule, and location.",
            },
            { status: 400 },
        );
    }

    const group = await prisma.group.findFirst({
        where: {
            id,
            createdById: access.authUserId,
        },
        select: {
            id: true,
            updatedAt: true,
            status: true,
            name: true,
            description: true,
            meetingSchedule: true,
            location: true,
        },
    });

    if (!group) {
        return Response.json(
            { error: "Group not found or access denied." },
            { status: 404 },
        );
    }

    if (body.updatedAt !== group.updatedAt.toISOString()) {
        return Response.json(
            {
                error: "This group has changed. Refresh the page and try again.",
            },
            { status: 409 },
        );
    }

    const hasChanges =
        input.name !== group.name ||
        input.description !== group.description ||
        input.meetingSchedule !== group.meetingSchedule ||
        input.location !== group.location;

    if (!hasChanges) {
        return Response.json(
            {
                error: "Please make changes before submitting your group.",
            },
            { status: 400 },
        );
    }

    const updated = await prisma.group.updateMany({
        where: {
            id,
            createdById: access.authUserId,
            updatedAt: group.updatedAt,
            status: group.status,
        },
        data: {
            ...input,
            status: "PENDING",
            reviewedAt: null,
            reviewNotificationReadAt: null,
        },
    });

    if (updated.count !== 1) {
        return Response.json(
            {
                error: "This group has changed. Refresh the page and try again.",
            },
            { status: 409 },
        );
    }

    return Response.json({
        status: "PENDING",
        message:
            "Your updated group has been submitted for administrator approval.",
    });
}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 },
        );
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (body?.confirm !== true) {
        return Response.json(
            { error: "Group deletion must be confirmed." },
            { status: 400 },
        );
    }

    const group = await prisma.group.findFirst({
        where: {
            id,
            ...(access.isAdmin
                ? {}
                : { createdById: access.authUserId }),
        },
        select: {
            id: true,
            updatedAt: true,
        },
    });

    if (!group) {
        return Response.json(
            { error: "Group not found or access denied." },
            { status: 404 },
        );
    }

    if (body.updatedAt !== group.updatedAt.toISOString()) {
        return Response.json(
            {
                error: "This group has changed. Refresh the page and try again.",
            },
            { status: 409 },
        );
    }

    const deleted = await prisma.group.deleteMany({
        where: {
            id,
            updatedAt: group.updatedAt,
            ...(access.isAdmin
                ? {}
                : { createdById: access.authUserId }),
        },
    });

    if (deleted.count !== 1) {
        return Response.json(
            {
                error: "This group has changed. Refresh the page and try again.",
            },
            { status: 409 },
        );
    }

    return Response.json({
        message: "Your group has been deleted.",
    });
}
