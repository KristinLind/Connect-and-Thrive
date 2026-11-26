
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FavoriteButton } from "@/components/activities/favorite-button";
import styles from "./event-dashboard.module.css";

type ActivityRecord = {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    canDelete: boolean;
    isSaved: boolean;
};

export function EventDashboard({
    initialEvents,
}: {
    initialEvents: ActivityRecord[];
}) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function createEvent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setPending(true);

        const formElement = event.currentTarget;
        const form = new FormData(formElement);

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.get("title"),
                    description: form.get("description"),
                    location: form.get("location"),
                    date: new Date(String(form.get("date"))).toISOString(),
                }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setError(result?.error ?? "Could not save the activity.");
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

    async function deleteEvent(id: string) {
        setError("");

        try {
            const response = await fetch(
                `/api/activities/${encodeURIComponent(id)}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                setError(result?.error ?? "Could not delete the activity.");
                return;
            }

            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        }
    }

    return (
        <main className={styles.page}>
            <header className={styles.pageHeader}>
                <h1>Community Events</h1>
                <p>
                    Discover upcoming activities, make new friends,
                    and bring your community together.
                </p>
            </header>

            {/* UPCOMING EVENTS FIRST */}
            <section className={styles.eventsSection}>
                <h2>Upcoming Events</h2>

                {initialEvents.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No upcoming events yet.</p>
                        <p>Be the first to create an activity!</p>
                    </div>
                ) : (
                    <div className={styles.eventGrid}>
                        {initialEvents.map((activity) => (
                            <article
                                key={activity.id}
                                className={styles.eventCard}
                            >
                                <h3>{activity.title}</h3>

                                <p>{activity.description}</p>

                                <p className={styles.eventMeta}>
                                    {activity.location}
                                </p>

                                <p className={styles.eventMeta}>
                                    {new Date(activity.date).toLocaleString()}
                                </p>

                                <div className={styles.eventActions}>
                                    <FavoriteButton
                                        activityId={activity.id}
                                        initialSaved={activity.isSaved}
                                    />

                                    {activity.canDelete && (
                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                deleteEvent(activity.id)
                                            }
                                        >
                                            Delete Event
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {error && initialEvents.length > 0 && (
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                )}
            </section>

            {/* CREATE EVENT FORM SECOND */}
            <section className={styles.formCard}>
                <h2>Create a Community Event</h2>

                <p className={styles.intro}>
                    Have an activity in mind? Share the details
                    and invite others to join you.
                </p>

                <form onSubmit={createEvent} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="event-title">
                            Event Name
                        </label>
                        <input
                            id="event-title"
                            name="title"
                            placeholder="e.g., Saturday Hiking Adventure"
                            required
                            maxLength={120}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="event-description">
                            Description
                        </label>
                        <textarea
                            id="event-description"
                            name="description"
                            placeholder="Describe the activity and what participants should bring."
                            required
                            maxLength={5000}
                            rows={4}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="event-location">
                            Location
                        </label>
                        <input
                            id="event-location"
                            name="location"
                            placeholder="e.g., South Jordan, Utah"
                            required
                            maxLength={300}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="event-date">
                            Date and Time
                        </label>
                        <input
                            id="event-date"
                            name="date"
                            type="datetime-local"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="event-capacity">
                            Maximum Number of Participants
                        </label>
                        <input
                            id="event-capacity"
                            name="capacity"
                            type="number"
                            min={1}
                            max={500}
                            placeholder="e.g., 12"
                        />
                        <p className={styles.helper}>
                            Optional. Participant limits will be saved once
                            the registration feature is connected.
                        </p>
                    </div>

                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className={styles.createButton}
                        disabled={pending}
                    >
                        {pending ? "Creating Event..." : "Create Event"}
                    </button>
                </form>
            </section>
        </main>
    );
}
