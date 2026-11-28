import { getAdminApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";
import { parseGroupInput } from "@/lib/groups/group-input";

export async function POST(request: Request) {
    const { response } = await getAdminApiAccess();
    if (response) return response;

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

    const created = await prisma.group.create({ data: group });
    return Response.json({ group: created }, { status: 201 });
}
