import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";
import { parseGroupInput } from "@/lib/groups/group-input";

export async function POST(request: Request) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 },
        );
    }

    const body = await request.json().catch(() => null);
    const group = parseGroupInput(body);

    if (!group) {
        return Response.json(
            {
                error: "Provide a name, description, meeting schedule, and location within the allowed lengths.",
            },
            { status: 400 },
        );
    }

    const created = await prisma.group.create({
        data: {
            ...group,
            createdById: access.authUserId,
            status: access.isAdmin ? "APPROVED" : "PENDING",
        },
    });

    return Response.json(
        {
            group: created,
            message: access.isAdmin
                ? "Your group has been created successfully."
                : "Your group has been submitted for administrator approval.",
        },
        { status: 201 },
    );
}

