import { EventDashboard } from "@/components/activities/event-dashboard";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function EventsPage() {
    const { access } = await requireApprovedAccess();

    const events = await prisma.activity.findMany({
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
            capacity: true,
            createdById: true,
            favorites: {
                where: {
                    userId: access.authUserId,
                },
                select: {
                    id: true,
                },
            },
            rsvps: {
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
            key={access.authUserId}
            initialEvents={events.map(
                ({
                    createdById,
                    favorites,
                    rsvps,
                    _count,
                    ...event
                }) => ({
                    ...event,
                    date: event.date.toISOString(),
                    canDelete:
                        access.isAdmin ||
                        createdById === access.authUserId,
                    isSaved: favorites.length > 0,
                    isRegistered: rsvps.length > 0,
                    registeredCount: _count.rsvps,
                    availableSpots:
                        event.capacity === null
                            ? null
                            : Math.max(
                                0,
                                event.capacity - _count.rsvps
                            ),
                    isFull:
                        event.capacity !== null &&
                        _count.rsvps >= event.capacity,
                })
            )}
        />
    );
}