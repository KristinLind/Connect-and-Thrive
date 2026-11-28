import { EventDashboard } from "@/components/activities/event-dashboard";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function RegisteredActivitiesPage() {
    const { access } = await requireApprovedAccess();

    const events = await prisma.activity.findMany({
        where: {
            date: {
                gte: new Date(),
            },
            rsvps: {
                some: {
                    userId: access.authUserId,
                },
            },
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
            capacity: true,
            favorites: {
                where: {
                    userId: access.authUserId,
                },
                select: {
                    id: true,
                },
            },
            _count: {
                select: {
                    rsvps: true,
                },
            },
        },
    });

    return (
        <EventDashboard
            registeredOnly={true}
            initialEvents={events.map((event) => {
                const registeredCount = event._count.rsvps;

                const availableSpots =
                    event.capacity === null
                        ? null
                        : Math.max(
                            0,
                            event.capacity - registeredCount
                        );

                return {
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: event.date.toISOString(),
                    capacity: event.capacity,
                    canDelete: false,
                    isSaved: event.favorites.length > 0,
                    isRegistered: true,
                    registeredCount,
                    availableSpots,
                    isFull:
                        event.capacity !== null &&
                        registeredCount >= event.capacity,
                };
            })}
        />
    );
}