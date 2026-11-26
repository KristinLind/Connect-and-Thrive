import { requireApprovedAccess } from "@/lib/auth/access";
import styles from "./page.module.css";

export const instant = false;

export default async function MyGroupsPage() {
  await requireApprovedAccess();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.heading}>
          <span className={styles.sectionLabel}>
            YOUR COMMUNITY
          </span>

          <h1>My Groups</h1>

          <p>
            Stay connected with the groups you have joined
            and build meaningful friendships within your community.
          </p>
        </section>

        <section className={styles.emptyState}>
          <h2>Group memberships</h2>

          <p>
            Your joined groups will be displayed here once
            group membership functionality is available.
          </p>
        </section>
      </main>
    </div>
  );
}