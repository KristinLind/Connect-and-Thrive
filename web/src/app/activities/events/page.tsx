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
            createdById: true,
            favorites: {
                where: {
                    userId: access.authUserId,
                },
                select: {
                    id: true,
                },
            },
        },
    });

    return (
        <EventDashboard
            initialEvents={events.map(
                ({ createdById, favorites, ...event }) => ({
                    ...event,
                    date: event.date.toISOString(),
                    canDelete:
                        access.isAdmin ||
                        createdById === access.authUserId,
                    isSaved: favorites.length > 0,
                })
            )}
        />
    );
}