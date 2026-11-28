import Link from "next/link";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import { FavoriteButton } from "@/components/activities/favorite-button";
import styles from "./page.module.css";

export const instant = false;

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
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heading}>
          <span className={styles.sectionLabel}>
            YOUR PERSONAL COLLECTION
          </span>

          <h1>My Saved Activities</h1>

          <p>
            Keep track of activities you&apos;re interested in and
            return to them whenever you&apos;re ready.
          </p>
        </section>

        {savedActivities.length === 0 ? (
          <section className={styles.emptyState}>
            <h2>No saved activities yet</h2>

            <p>
              Explore activities and save the ones that
              interest you!
            </p>

            <Link
              href="/activities/events"
              className={styles.button}
            >
              Explore Upcoming Activities
            </Link>
          </section>
        ) : (
          <section className={styles.grid}>
            {savedActivities.map((favorite) => (
              <article
                key={favorite.id}
                className={styles.card}
              >
                <h2>{favorite.activity.title}</h2>

                <p>{favorite.activity.description}</p>

                <div className={styles.details}>
                  <p>
                    <strong>Location:</strong>{" "}
                    {favorite.activity.location}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {favorite.activity.date.toLocaleDateString("en-US")}
                  </p>
                </div>

                <FavoriteButton
                  activityId={favorite.activity.id}
                  initialSaved={true}
                  removeOnly={true}
                />
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
