import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

async function getMembershipContext(params: RouteContext["params"]) {
    const { response, access } = await getApprovedApiAccess();
    if (response) return { response, access: null, groupId: null };
    if (!access) {
        return {
            response: Response.json(
                { error: "Approved access required." },
                { status: 403 },
            ),
            access: null,
            groupId: null,
        };
    }

    const { id: groupId } = await params;
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { id: true },
    });
    if (!group) {
        return {
            response: Response.json({ error: "Group not found." }, { status: 404 }),
            access: null,
            groupId: null,
        };
    }

    return { response: null, access, groupId };
}

export async function POST(_request: Request, { params }: RouteContext) {
    const context = await getMembershipContext(params);
    if (context.response) return context.response;
    if (!context.access || !context.groupId) {
        return Response.json({ error: "Approved access required." }, { status: 403 });
    }

    await prisma.groupMembership.upsert({
        where: {
            groupId_authUserId: {
                groupId: context.groupId,
                authUserId: context.access.authUserId,
            },
        },
        update: {},
        create: {
            groupId: context.groupId,
            authUserId: context.access.authUserId,
        },
    });

    return Response.json({ joined: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const context = await getMembershipContext(params);
    if (context.response) return context.response;
    if (!context.access || !context.groupId) {
        return Response.json({ error: "Approved access required." }, { status: 403 });
    }

    await prisma.groupMembership.deleteMany({
        where: {
            groupId: context.groupId,
            authUserId: context.access.authUserId,
        },
    });

    return Response.json({ joined: false });
}
