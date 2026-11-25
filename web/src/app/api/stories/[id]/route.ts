import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { canEditPendingStory, canManageOwnedResource } from "@/lib/auth/api-access-policy";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const { id } = await params;
    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Story not found." }, { status: 404 });
    const body = await request.json().catch(() => null) as { title?: unknown; content?: unknown; status?: unknown } | null;
    if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });
    if (body.status !== undefined) {
        if (!access.isAdmin || !["PENDING", "APPROVED", "REJECTED"].includes(String(body.status))) {
            return Response.json({ error: "Only admins can review stories." }, { status: 403 });
        }
        const story = await prisma.story.update({ where: { id }, data: { status: body.status as "PENDING" | "APPROVED" | "REJECTED" } });
        return Response.json({ story });
    }
    if (!canEditPendingStory(existing.authorId, access.authUserId, existing.status, access.isAdmin)) {
        return Response.json({ error: "You can only edit your own pending stories." }, { status: 403 });
    }
    const data: { title?: string; content?: string } = {};
    if ("title" in body) {
        if (typeof body.title !== "string" || !body.title.trim() || body.title.length > 160) return Response.json({ error: "Invalid title." }, { status: 400 });
        data.title = body.title.trim();
    }
    if ("content" in body) {
        if (typeof body.content !== "string" || !body.content.trim() || body.content.length > 10000) return Response.json({ error: "Invalid story content." }, { status: 400 });
        data.content = body.content.trim();
    }
    const story = await prisma.story.update({ where: { id }, data });
    return Response.json({ story });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const { id } = await params;
    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Story not found." }, { status: 404 });
    if (!canManageOwnedResource(existing.authorId, access.authUserId, access.isAdmin)) return Response.json({ error: "You can only delete your own stories." }, { status: 403 });
    await prisma.story.delete({ where: { id } });
    return new Response(null, { status: 204 });
}
