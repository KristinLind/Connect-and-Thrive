import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const stories = await prisma.story.findMany({
        where: access.isAdmin ? {} : { OR: [{ authorId: access.authUserId }, { status: "APPROVED" }] },
        orderBy: { createdAt: "desc" },
    });
    return Response.json({ stories });
}

export async function POST(request: Request) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return response;
    if (!access) return Response.json({ error: "Approved access required." }, { status: 403 });
    const body = await request.json().catch(() => null) as { title?: unknown; content?: unknown } | null;
    if (!body || typeof body.title !== "string" || !body.title.trim() || body.title.length > 160 ||
        typeof body.content !== "string" || !body.content.trim() || body.content.length > 10000) {
        return Response.json({ error: "Provide a title (up to 160 characters) and story (up to 10,000 characters)." }, { status: 400 });
    }
    const story = await prisma.story.create({ data: {
        authorId: access.authUserId, title: body.title.trim(), content: body.content.trim(),
    } });
    return Response.json({ story }, { status: 201 });
}
