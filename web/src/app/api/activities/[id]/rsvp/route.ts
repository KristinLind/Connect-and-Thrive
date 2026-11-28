import { getApprovedApiAccess } from "@/lib/auth/api-access";
import { prisma } from "@/lib/prisma";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// Register the current member for an event.
export async function POST(
    _request: Request,
    { params }: RouteContext
) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 }
        );
    }

    const { id } = await params;
    const userId = access.authUserId;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Lock the activity to prevent simultaneous overbooking.
            await tx.$queryRaw`
                SELECT "id"
                FROM "Activity"
                WHERE "id" = ${id}
                FOR UPDATE
            `;

            const activity = await tx.activity.findUnique({
                where: { id },
                select: {
                    id: true,
                    capacity: true,
                    date: true,
                    _count: {
                        select: {
                            rsvps: true,
                        },
                    },
                },
            });

            if (!activity) {
                return {
                    status: 404,
                    body: { error: "Event not found." },
                };
            }

            if (activity.date <= new Date()) {
                return {
                    status: 400,
                    body: {
                        error: "Registration for this event has closed.",
                    },
                };
            }

            const existing = await tx.rSVP.findUnique({
                where: {
                    userId_activityId: {
                        userId,
                        activityId: id,
                    },
                },
            });

            if (existing) {
                return {
                    status: 200,
                    body: {
                        registered: true,
                        registeredCount: activity._count.rsvps,
                        availableSpots:
                            activity.capacity === null
                                ? null
                                : Math.max(
                                    0,
                                    activity.capacity -
                                    activity._count.rsvps
                                ),
                    },
                };
            }

            if (
                activity.capacity !== null &&
                activity._count.rsvps >= activity.capacity
            ) {
                return {
                    status: 409,
                    body: {
                        error: "This event is full.",
                    },
                };
            }

            await tx.rSVP.create({
                data: {
                    userId,
                    activityId: id,
                },
            });

            const registeredCount = activity._count.rsvps + 1;

            return {
                status: 201,
                body: {
                    registered: true,
                    registeredCount,
                    availableSpots:
                        activity.capacity === null
                            ? null
                            : Math.max(
                                0,
                                activity.capacity - registeredCount
                            ),
                },
            };
        });

        return Response.json(result.body, {
            status: result.status,
        });
    } catch (error) {
        console.error("Event registration error:", error);

        return Response.json(
            { error: "Unable to register for this event." },
            { status: 500 }
        );
    }
}

// Cancel the current member's registration.
export async function DELETE(
    _request: Request,
    { params }: RouteContext
) {
    const { response, access } = await getApprovedApiAccess();

    if (response) return response;

    if (!access) {
        return Response.json(
            { error: "Approved access required." },
            { status: 403 }
        );
    }

    const { id } = await params;
    const userId = access.authUserId;

    try {
        const result = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`
                SELECT "id"
                FROM "Activity"
                WHERE "id" = ${id}
                FOR UPDATE
            `;

            const activity = await tx.activity.findUnique({
                where: { id },
                select: {
                    capacity: true,
                },
            });

            if (!activity) {
                return {
                    status: 404,
                    body: { error: "Event not found." },
                };
            }

            await tx.rSVP.deleteMany({
                where: {
                    userId,
                    activityId: id,
                },
            });

            const registeredCount = await tx.rSVP.count({
                where: {
                    activityId: id,
                },
            });

            return {
                status: 200,
                body: {
                    registered: false,
                    registeredCount,
                    availableSpots:
                        activity.capacity === null
                            ? null
                            : Math.max(
                                0,
                                activity.capacity - registeredCount
                            ),
                },
            };
        });

        return Response.json(result.body, {
            status: result.status,
        });
    } catch (error) {
        console.error("Event cancellation error:", error);

        return Response.json(
            { error: "Unable to cancel your registration." },
            { status: 500 }
        );
    }
}