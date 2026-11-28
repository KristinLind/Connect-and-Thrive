"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./group-actions.module.css";

export function GroupMembershipButton({
  groupId,
  initialJoined,
}: {
  groupId: string;
  initialJoined: boolean;
}) {
  const router = useRouter();
  const [joined, setJoined] = useState(initialJoined);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function updateMembership() {
    setPending(true);
    setError("");

    try {
      const response = await fetch(
        `/api/groups/${encodeURIComponent(groupId)}/membership`,
        { method: joined ? "DELETE" : "POST" },
      );
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.error ?? "Could not update your group membership.");
        return;
      }

      setJoined(result.joined === true);
      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.action}>
      <button
        className={styles.button}
        type="button"
        onClick={updateMembership}
        disabled={pending}
        aria-pressed={joined}
      >
        {pending ? "Updating…" : joined ? "Leave group" : "Join group"}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
