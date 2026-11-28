import { GroupCreateForm } from "@/components/groups/group-create-form";
import { GroupMembershipButton } from "@/components/groups/group-membership-button";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const instant = false;

export default async function MyGroupsPage() {
  const { access } = await requireApprovedAccess();
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
    include: {
      memberships: {
        where: { authUserId: access.authUserId },
        select: { id: true },
      },
    },
  });

  const joinedGroups = groups.filter((group) => group.memberships.length > 0);
  const availableGroups = groups.filter((group) => group.memberships.length === 0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heading}>
          <span className={styles.sectionLabel}>YOUR COMMUNITY</span>
          <h1>My Groups</h1>
          <p>
            Stay connected with the groups you have joined and build meaningful
            friendships within your community.
          </p>
        </section>

        {access.isAdmin && (
          <section className={styles.adminSection} aria-labelledby="create-group-heading">
            <h2 id="create-group-heading">Create a group</h2>
            <p>Add a recurring group so approved members can join it.</p>
            <GroupCreateForm />
          </section>
        )}

        <section aria-labelledby="joined-groups-heading">
          <h2 className={styles.listHeading} id="joined-groups-heading">
            Groups you&apos;ve joined
          </h2>
          {joinedGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No group memberships yet</h3>
              <p>Choose a group below to join and it will appear here.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {joinedGroups.map((group) => (
                <article className={styles.card} key={group.id}>
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className={styles.details}>
                    <p>
                      <strong>Meeting schedule:</strong> {group.meetingSchedule}
                    </p>
                    <p>
                      <strong>Location:</strong> {group.location}
                    </p>
                  </div>
                  <GroupMembershipButton
                    groupId={group.id}
                    initialJoined
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className={styles.availableSection} aria-labelledby="available-groups-heading">
          <h2 className={styles.listHeading} id="available-groups-heading">
            Find a group
          </h2>
          {availableGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No other groups are available right now</h3>
              <p>Check back later for more opportunities to connect.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {availableGroups.map((group) => (
                <article className={styles.card} key={group.id}>
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className={styles.details}>
                    <p>
                      <strong>Meeting schedule:</strong> {group.meetingSchedule}
                    </p>
                    <p>
                      <strong>Location:</strong> {group.location}
                    </p>
                  </div>
                  <GroupMembershipButton
                    groupId={group.id}
                    initialJoined={false}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
