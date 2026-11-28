"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./group-actions.module.css";

export function GroupCreateForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          meetingSchedule: form.get("meetingSchedule"),
          location: form.get("location"),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.error ?? "Could not create the group.");
        return;
      }

      formElement.reset();
      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={createGroup}>
      <label>
        Group name
        <input name="name" required maxLength={120} />
      </label>
      <label>
        Description
        <textarea name="description" required maxLength={5000} rows={3} />
      </label>
      <label>
        Meeting schedule
        <input
          name="meetingSchedule"
          required
          maxLength={500}
          placeholder="For example: Thursdays at 7:00 PM"
        />
      </label>
      <label>
        Location
        <input name="location" required maxLength={300} />
      </label>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.button} type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create group"}
      </button>
    </form>
  );
}
