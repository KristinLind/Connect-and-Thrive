
import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const { response } = await getApprovedApiAccess();
    if (response) return response;

    const activities = await prisma.activity.findMany({
        where: {
            date: { gte: new Date() },
        },
        orderBy: {
            date: "asc",
        },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            date: true,
            image: true,
            capacity: true,
            _count: {
                select: {
                    rsvps: true,
                },
            },
        },
    });

    return Response.json({
        activities: activities.map(({ _count, ...activity }) => ({
            ...activity,
            registeredCount: _count.rsvps,
            availableSpots:
                activity.capacity === null
                    ? null
                    : Math.max(0, activity.capacity - _count.rsvps),
            isFull:
                activity.capacity !== null &&
                _count.rsvps >= activity.capacity,
        })),
    });
}

export async function POST(request: Request) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 }
        );
    }

    const body = await request.json().catch(() => null) as
        Record<string, unknown> | null;

    if (
        !body ||
        typeof body.title !== "string" ||
        !body.title.trim() ||
        body.title.length > 120 ||
        typeof body.description !== "string" ||
        !body.description.trim() ||
        body.description.length > 5000 ||
        typeof body.location !== "string" ||
        !body.location.trim() ||
        body.location.length > 300 ||
        typeof body.date !== "string" ||
        Number.isNaN(Date.parse(body.date)) ||
        (
            body.image !== undefined &&
            body.image !== null &&
            (
                typeof body.image !== "string" ||
                body.image.length > 1000
            )
        )
    ) {
        return Response.json(
            {
                error: "Provide a title, description, location, and valid date.",
            },
            { status: 400 }
        );
    }

    // Prevent members from creating events in the past.
    const eventDate = new Date(body.date);

    if (eventDate.getTime() <= Date.now()) {
        return Response.json(
            {
                error: "Please select an event date and time in the future.",
            },
            { status: 400 }
        );
    }

    let capacity: number | null = null;

    if (body.capacity !== undefined && body.capacity !== null) {
        if (
            typeof body.capacity !== "number" ||
            !Number.isInteger(body.capacity) ||
            body.capacity < 1 ||
            body.capacity > 500
        ) {
            return Response.json(
                {
                    error: "Maximum participants must be a whole number between 1 and 500.",
                },
                { status: 400 }
            );
        }

        capacity = body.capacity;
    }

    const activity = await prisma.activity.create({
        data: {
            title: body.title.trim(),
            description: body.description.trim(),
            location: body.location.trim(),
            date: eventDate,
            image:
                typeof body.image === "string"
                    ? body.image.trim() || null
                    : null,
            capacity,
            createdById: access.authUserId,
        },
    });

    return Response.json({ activity }, { status: 201 });
}
