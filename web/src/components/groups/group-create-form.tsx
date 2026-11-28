"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./group-actions.module.css";

type GroupCreateFormProps = {
  isAdmin: boolean;
};

export function GroupCreateForm({
  isAdmin,
}: GroupCreateFormProps) {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function createGroup(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPending(true);
    setError("");
    setSuccess("");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          meetingSchedule: form.get("meetingSchedule"),
          location: form.get("location"),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          result?.error ?? "Could not create the group.",
        );
        return;
      }

      setSuccess(
        result?.message ??
        "Your group has been submitted successfully.",
      );

      formElement.reset();
      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={createGroup}
    >
      <label>
        Group name
        <input
          name="name"
          required
          maxLength={120}
          placeholder="For example: Saturday Hiking Club"
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          required
          maxLength={5000}
          rows={3}
          placeholder="Tell members what your group is about."
        />
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
        <input
          name="location"
          required
          maxLength={300}
          placeholder="Where will your group meet?"
        />
      </label>

      {!isAdmin && (
        <p
          style={{
            background: "#f0f9f9",
            color: "#20364d",
            padding: "14px 16px",
            borderRadius: 10,
            lineHeight: 1.6,
          }}
        >
          All member-created groups are reviewed by an
          administrator before becoming available to the
          Connect &amp; Thrive community. You can track
          your submission under Groups you&apos;ve created.
        </p>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px 16px",
            borderRadius: 10,
          }}
        >
          {success}
        </p>
      )}

      <button
        className={styles.button}
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Submitting…"
          : isAdmin
            ? "Create group"
            : "Submit group for approval"}
      </button>
    </form>
  );
}

