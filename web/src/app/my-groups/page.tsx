import { GroupCreateForm } from "@/components/groups/group-create-form";
import { GroupManagementActions } from "@/components/groups/group-management-actions";
import { GroupReviewNotification } from "@/components/groups/group-review-notification";
import { GroupMembershipButton } from "@/components/groups/group-membership-button";
import { requireApprovedAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const instant = false;

export default async function MyGroupsPage() {
  const { access } = await requireApprovedAccess();

  const groups = await prisma.group.findMany({
    where: {
      OR: [
        { status: "APPROVED" },
        { createdById: access.authUserId },
      ],
    },
    orderBy: { name: "asc" },
    include: {
      memberships: {
        where: { authUserId: access.authUserId },
        select: { id: true },
      },
    },
  });

  const createdGroups = groups.filter(
    (group) => group.createdById === access.authUserId,
  );

  const joinedGroups = groups.filter(
    (group) =>
      group.status === "APPROVED" &&
      group.memberships.length > 0,
  );

  const availableGroups = groups.filter(
    (group) =>
      group.status === "APPROVED" &&
      group.memberships.length === 0,
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heading}>
          <span className={styles.sectionLabel}>
            YOUR COMMUNITY
          </span>

          <h1>My Groups</h1>

          <p>
            Stay connected with the groups you have joined,
            create new opportunities, and build meaningful
            friendships within your community.
          </p>
        </section>

        <section
          className={styles.adminSection}
          id="create-group"
          style={{ scrollMarginTop: 160 }}
          aria-labelledby="create-group-heading"
        >
          <h2 id="create-group-heading">
            Create a group
          </h2>

          <p>
            {access.isAdmin
              ? "Create a recurring group that approved members can discover and join."
              : "Have an idea for a recurring group? Submit your group for administrator approval and bring members together."}
          </p>

          <GroupCreateForm isAdmin={access.isAdmin} />
        </section>

        <section
          className={styles.availableSection}
          id="created-groups"
          style={{ scrollMarginTop: 160 }}
          aria-labelledby="created-groups-heading"
        >
          <h2
            className={styles.listHeading}
            id="created-groups-heading"
          >
            Groups you&apos;ve created
          </h2>

          {createdGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No groups created yet</h3>
              <p>
                Share your interests and start a group
                using the form above.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {createdGroups.map((group) => (
                <article
                  className={styles.card}
                  key={group.id}
                >
                  <h3>{group.name}</h3>

                  <span
                    style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      background:
                        group.status === "APPROVED"
                          ? "#dcfce7"
                          : group.status === "PENDING"
                            ? "#fef3c7"
                            : "#fee2e2",
                      color:
                        group.status === "APPROVED"
                          ? "#166534"
                          : group.status === "PENDING"
                            ? "#92400e"
                            : "#991b1b",
                    }}
                  >
                    {group.status === "APPROVED"
                      ? "Approved"
                      : group.status === "PENDING"
                        ? "Pending approval"
                        : "Not approved"}
                  </span>

                  <p>{group.description}</p>

                  <div className={styles.details}>
                    <p>
                      <strong>Meeting schedule:</strong>{" "}
                      {group.meetingSchedule}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {group.location}
                    </p>
                  </div>

                  {group.reviewFeedback && (
                    <div
                      style={{
                        background: "#f0f9f9",
                        border: "1px solid #b8dddd",
                        borderLeft: "4px solid #087b83",
                        borderRadius: 10,
                        padding: 16,
                        marginTop: 12,
                      }}
                    >
                      <strong style={{ color: "#087b83" }}>
                        Private administrator feedback
                      </strong>

                      <p
                        style={{
                          color: "#20364d",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                          lineHeight: 1.7,
                          marginTop: 8,
                          marginBottom: 8,
                        }}
                      >
                        {group.reviewFeedback}
                      </p>

                      <small style={{ color: "#64748b" }}>
                        This feedback is visible only to you
                        and administrators.
                      </small>
                    </div>
                  )}

                  {group.reviewedAt &&
                    !group.reviewNotificationReadAt &&
                    (group.status === "APPROVED" ||
                      group.status === "REJECTED") && (
                      <GroupReviewNotification
                        key={`${group.id}-${group.reviewedAt.toISOString()}`}
                        groupId={group.id}
                        status={group.status}
                        reviewedAt={group.reviewedAt.toISOString()}
                      />
                    )}

                  {group.status === "PENDING" && (
                    <p>
                      Your group is awaiting administrator
                      review. Other members cannot see or
                      join it yet.
                    </p>
                  )}

                  {group.status === "APPROVED" && (
                    <p>
                      Your group is available for approved
                      members to discover and join.
                    </p>
                  )}

                  {group.status === "REJECTED" && (
                    <p>
                      Your group has not been approved
                      and is not visible to other members.
                      You can edit your group using the administrator
                      feedback and resubmit it for approval.
                    </p>
                  )}

                  <GroupManagementActions
                    key={`${group.id}-${group.updatedAt.toISOString()}`}
                    groupId={group.id}
                    name={group.name}
                    description={group.description}
                    meetingSchedule={group.meetingSchedule}
                    location={group.location}
                    status={group.status}
                    updatedAt={group.updatedAt.toISOString()}
                  />
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          className={styles.availableSection}
          aria-labelledby="joined-groups-heading"
        >
          <h2
            className={styles.listHeading}
            id="joined-groups-heading"
          >
            Groups you&apos;ve joined
          </h2>

          {joinedGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No group memberships yet</h3>
              <p>
                Choose a group below to join and it will
                appear here.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {joinedGroups.map((group) => (
                <article
                  className={styles.card}
                  key={group.id}
                >
                  <h3>{group.name}</h3>

                  <p>{group.description}</p>

                  <div className={styles.details}>
                    <p>
                      <strong>Meeting schedule:</strong>{" "}
                      {group.meetingSchedule}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {group.location}
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

        <section
          className={styles.availableSection}
          aria-labelledby="available-groups-heading"
        >
          <h2
            className={styles.listHeading}
            id="available-groups-heading"
          >
            Find a group
          </h2>

          {availableGroups.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No other groups are available right now</h3>
              <p>
                Check back later for more opportunities
                to connect.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {availableGroups.map((group) => (
                <article
                  className={styles.card}
                  key={group.id}
                >
                  <h3>{group.name}</h3>

                  <p>{group.description}</p>

                  <div className={styles.details}>
                    <p>
                      <strong>Meeting schedule:</strong>{" "}
                      {group.meetingSchedule}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {group.location}
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
