import { getCurrentAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
    const current = await getCurrentAccess();

    if (!current) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
    }

    if (
        !current.access ||
        current.access.status !== "APPROVED" ||
        !current.access.isAdmin
    ) {
        return Response.json({ error: "Admin access required." }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as
        | { authUserId?: unknown; action?: unknown }
        | null;

    if (
        !body ||
        typeof body.authUserId !== "string" ||
        !["approve", "block", "unblock"].includes(String(body.action))
    ) {
        return Response.json({ error: "Invalid request." }, { status: 400 });
    }

    const target = await prisma.userAccess.findUnique({
        where: { authUserId: body.authUserId },
    });

    if (!target) {
        return Response.json({ error: "Account not found." }, { status: 404 });
    }

    if (target.isAdmin) {
        return Response.json(
            { error: "Admin accounts cannot be changed here." },
            { status: 403 },
        );
    }

    const status = body.action === "block" ? "BLOCKED" : "APPROVED";

    const updated = await prisma.userAccess.update({
        where: { authUserId: target.authUserId },
        data: { status },
    });

    return Response.json({ status: updated.status });
}