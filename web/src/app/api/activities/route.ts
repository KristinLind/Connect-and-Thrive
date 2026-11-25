import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { response } = await getApprovedApiAccess();
    if (response) return response;

    const activities = await prisma.activity.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        select: { id: true, title: true, description: true, location: true, date: true, image: true },
    });
    return Response.json({ activities });
}

export async function POST(request: Request) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!body || typeof body.title !== "string" || !body.title.trim() || body.title.length > 120 ||
        typeof body.description !== "string" || !body.description.trim() || body.description.length > 5000 ||
        typeof body.location !== "string" || !body.location.trim() || body.location.length > 300 ||
        typeof body.date !== "string" || Number.isNaN(Date.parse(body.date)) ||
        (body.image !== undefined && body.image !== null && (typeof body.image !== "string" || body.image.length > 1000))) {
        return Response.json({ error: "Provide a title, description, location, and valid date." }, { status: 400 });
    }

    const activity = await prisma.activity.create({
        data: {
            title: body.title.trim(), description: body.description.trim(), location: body.location.trim(),
            date: new Date(body.date), image: typeof body.image === "string" ? body.image.trim() || null : null,
            createdById: access.authUserId,
        },
    });
    return Response.json({ activity }, { status: 201 });
}
