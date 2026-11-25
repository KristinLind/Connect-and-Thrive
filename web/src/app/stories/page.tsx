import { StoryDashboard } from "@/components/stories/story-dashboard";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const instant = false;

export default async function StoriesPage() {
    const { access } = await requireApprovedAccess();
    const stories = await prisma.story.findMany({
        where: access.isAdmin ? {} : { OR: [{ authorId: access.authUserId }, { status: "APPROVED" }] },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
    });
    return <StoryDashboard stories={stories} userId={access.authUserId} />;
}
