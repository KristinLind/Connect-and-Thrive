import Link from "next/link";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export default async function SavedActivitiesPage() {
    const { session } = await requireApprovedAccess();

    const savedActivities = await prisma.favorite.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            activity: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      <h1>My Saved Activities</h1>

      <p>
        Keep track of activities you're interested in and
        return to them whenever you're ready.
      </p>

      {savedActivities.length === 0 ? (
        <div>
          <h2>No saved activities yet</h2>
          <p>
            Explore activities and save the ones that interest you!
          </p>
          <Link href="/activities">Explore Activities</Link>
        </div>
      ) : (
        <div>
          {savedActivities.map((favorite) => (
            <article key={favorite.id}>
              <h2>{favorite.activity.title}</h2>
              <p>{favorite.activity.description}</p>
              <p>Location: {favorite.activity.location}</p>
              <p>
                Date: {favorite.activity.date.toLocaleDateString("en-US")}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}