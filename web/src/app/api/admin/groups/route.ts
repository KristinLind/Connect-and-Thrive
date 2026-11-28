import { getAdminApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
    const { response, access } = await getAdminApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Admin access required." },
            { status: 403 },
        );
    }

    const body = await request.json().catch(() => null);

    if (
        !body ||
        typeof body.groupId !== "string" ||
        !body.groupId.trim() ||
        !["approve", "reject", "feedback"].includes(body.action)
    ) {
        return Response.json(
            { error: "Invalid group approval request." },
            { status: 400 },
        );
    }

    if (
        body.feedback !== undefined &&
        typeof body.feedback !== "string"
    ) {
        return Response.json(
            { error: "Invalid administrator feedback." },
            { status: 400 },
        );
    }

    const feedback =
        typeof body.feedback === "string"
            ? body.feedback.trim()
            : "";

    if (feedback.length > 3000) {
        return Response.json(
            { error: "Feedback cannot exceed 3000 characters." },
            { status: 400 },
        );
    }

    if (body.action === "feedback" && !feedback) {
        return Response.json(
            { error: "Please enter feedback for the group creator." },
            { status: 400 },
        );
    }

    const group = await prisma.group.findUnique({
        where: {
            id: body.groupId,
        },
        select: {
            id: true,
            status: true,
            updatedAt: true,
            createdById: true,
            reviewFeedback: true,
        },
    });

    if (!group) {
        return Response.json(
            { error: "Group not found." },
            { status: 404 },
        );
    }

    const allowed =
        (body.action === "approve" &&
            ["PENDING", "REJECTED"].includes(group.status)) ||
        (body.action === "reject" &&
            group.status === "PENDING") ||
        (body.action === "feedback" &&
            group.status === "REJECTED" &&
            group.createdById !== null);

    if (!allowed) {
        return Response.json(
            { error: "This action is not available for the current group status." },
            { status: 409 },
        );
    }

    if (
        typeof body.updatedAt !== "string" ||
        body.updatedAt !== group.updatedAt.toISOString()
    ) {
        return Response.json(
            { error: "This submission has changed. Refresh the page and review it again." },
            { status: 409 },
        );
    }

    const status =
        body.action === "approve"
            ? "APPROVED"
            : body.action === "reject"
                ? "REJECTED"
                : group.status;

    const updated = await prisma.group.updateMany({
        where: {
            id: group.id,
            status: group.status,
            updatedAt: group.updatedAt,
        },
        data: {
            status,
            reviewFeedback:
                body.action === "approve"
                    ? feedback || null
                    : feedback || group.reviewFeedback,
            reviewedAt: new Date(),
            reviewNotificationReadAt: null,
        },
    });

    if (updated.count !== 1) {
        return Response.json(
            { error: "This submission has changed. Refresh the page and review it again." },
            { status: 409 },
        );
    }

    return Response.json({
        status,
        message:
            body.action === "feedback"
                ? "Feedback sent successfully."
                : status === "APPROVED"
                    ? "Group approved successfully."
                    : "Group submission rejected.",
    });
}
