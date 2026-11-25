import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { canManageOwnedResource } from "@/lib/auth/api-access-policy";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const { id } = await params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Activity not found." }, { status: 404 });
    if (!canManageOwnedResource(existing.createdById, access.authUserId, access.isAdmin)) {
        return Response.json({ error: "You can only edit your own activities." }, { status: 403 });
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });
    const data: { title?: string; description?: string; location?: string; date?: Date; image?: string | null } = {};
    for (const field of ["title", "description", "location"] as const) {
        if (field in body) {
            if (typeof body[field] !== "string" || !body[field].trim() || body[field].length > (field === "description" ? 5000 : field === "title" ? 120 : 300)) {
                return Response.json({ error: `Invalid ${field}.` }, { status: 400 });
            }
            data[field] = (body[field] as string).trim();
        }
    }
    if ("date" in body) {
        if (typeof body.date !== "string" || Number.isNaN(Date.parse(body.date))) return Response.json({ error: "Invalid date." }, { status: 400 });
        data.date = new Date(body.date);
    }
    if ("image" in body) {
        if (body.image !== null && (typeof body.image !== "string" || body.image.length > 1000)) return Response.json({ error: "Invalid image." }, { status: 400 });
        data.image = typeof body.image === "string" ? body.image.trim() || null : null;
    }
    const activity = await prisma.activity.update({ where: { id }, data });
    return Response.json({ activity });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const { id } = await params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Activity not found." }, { status: 404 });
    if (!canManageOwnedResource(existing.createdById, access.authUserId, access.isAdmin)) {
        return Response.json({ error: "You can only delete your own activities." }, { status: 403 });
    }
    await prisma.activity.delete({ where: { id } });
    return new Response(null, { status: 204 });
}
