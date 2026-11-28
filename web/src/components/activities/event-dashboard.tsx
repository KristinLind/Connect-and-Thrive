"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FavoriteButton } from "@/components/activities/favorite-button";
import styles from "./event-dashboard.module.css";
import Link from "next/link";

type ActivityRecord = {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    canDelete: boolean;
    isSaved: boolean;
    capacity: number | null;
    isRegistered: boolean;
    registeredCount: number;
    availableSpots: number | null;
    isFull: boolean;
};

export function EventDashboard({
    initialEvents,
    registeredOnly = false,
}: {
    initialEvents: ActivityRecord[];
    registeredOnly?: boolean;
}) {
    const router = useRouter();
    useEffect(() => {
        function refreshEvents() {
            if (document.visibilityState === "visible") {
                router.refresh();
            }
        }

        const interval = window.setInterval(refreshEvents, 5000);

        window.addEventListener("focus", refreshEvents);
        document.addEventListener("visibilitychange", refreshEvents);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener("focus", refreshEvents);
            document.removeEventListener(
                "visibilitychange",
                refreshEvents
            );
        };
    }, [router]);

    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);
    const [registrationPending, setRegistrationPending] =
        useState<string | null>(null);

    async function createEvent(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setPending(true);

        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        const capacityValue = String(form.get("capacity") ?? "").trim();
        const eventDate = new Date(String(form.get("date")));

        if (
            Number.isNaN(eventDate.getTime()) ||
            eventDate.getTime() <= Date.now()
        ) {
            setError("Please select an event date and time in the future.");
            setPending(false);
            return;
        }

        try {
            const response = await fetch("/api/activities", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.get("title"),
                    description: form.get("description"),
                    location: form.get("location"),
                    date: eventDate.toISOString(),
                    capacity:
                        capacityValue === ""
                            ? null
                            : Number(capacityValue),
                }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ?? "Could not save the activity."
                );
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

    async function toggleRegistration(activity: ActivityRecord) {
        if (registrationPending !== null) return;

        setError("");
        setRegistrationPending(activity.id);

        try {
            const response = await fetch(
                `/api/activities/${encodeURIComponent(activity.id)}/rsvp`,
                {
                    method: activity.isRegistered ? "DELETE" : "POST",
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ??
                    "Could not update your registration."
                );

                router.refresh();
                return;
            }

            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setRegistrationPending(null);
        }
    }

    async function deleteEvent(id: string) {
        if (
            !window.confirm(
                "Are you sure you want to delete this event? All registrations for this event will also be removed."
            )
        ) {
            return;
        }

        setError("");

        try {
            const response = await fetch(
                `/api/activities/${encodeURIComponent(id)}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                const result = await response.json().catch(() => null);

                setError(
                    result?.error ?? "Could not delete the activity."
                );

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
                <h1>
                    {registeredOnly
                        ? "My Registered Activities"
                        : "Community Events"}
                </h1>

                <p>
                    {registeredOnly
                        ? "Keep track of your upcoming activities and manage your event registrations."
                        : "Discover upcoming activities, make new friends, and bring your community together."}
                </p>

                {registeredOnly && (
                    <Link
                        href="/activities/events"
                        className={styles.joinButton}
                    >
                        Browse Community Events →
                    </Link>
                )}
            </header>

            <section className={styles.eventsSection}>
                <h2>
                    {registeredOnly
                        ? "Your Upcoming Activities"
                        : "Upcoming Events"}
                </h2>

                {initialEvents.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>
                            {registeredOnly
                                ? "You haven't registered for any upcoming activities yet."
                                : "No upcoming events yet."}
                        </p>
                        <p>
                            {registeredOnly
                                ? "Explore community events and find something you would love to join!"
                                : "Be the first to create an activity!"}
                        </p>
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
                                    {new Date(
                                        activity.date
                                    ).toLocaleString()}
                                </p>

                                <div className={styles.capacitySection}>
                                    <div className={styles.capacitySummary}>
                                        <span>
                                            {activity.capacity === null
                                                ? `${activity.registeredCount} registered`
                                                : `${activity.registeredCount} of ${activity.capacity} registered`}
                                        </span>

                                        <span
                                            className={
                                                activity.isFull
                                                    ? styles.fullStatus
                                                    : styles.availableStatus
                                            }
                                        >
                                            {activity.isFull
                                                ? "Event Full"
                                                : activity.availableSpots === null
                                                    ? "Open Registration"
                                                    : `${activity.availableSpots} ${activity.availableSpots === 1 ? "spot" : "spots"} available`}
                                        </span>
                                    </div>

                                    {activity.capacity !== null && (
                                        <div
                                            className={styles.capacityTrack}
                                            role="progressbar"
                                            aria-label="Event capacity"
                                            aria-valuemin={0}
                                            aria-valuemax={activity.capacity}
                                            aria-valuenow={Math.min(
                                                activity.registeredCount,
                                                activity.capacity
                                            )}
                                        >
                                            <div
                                                className={
                                                    activity.isFull
                                                        ? styles.capacityFillFull
                                                        : styles.capacityFill
                                                }
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (activity.registeredCount /
                                                            activity.capacity) *
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    )}

                                    {activity.isRegistered && (
                                        <p className={styles.registeredStatus}>
                                            ✓ You're registered!
                                        </p>
                                    )}
                                </div>

                                <div className={styles.eventActions}>
                                    <FavoriteButton
                                        activityId={activity.id}
                                        initialSaved={activity.isSaved}
                                    />

                                    <button
                                        type="button"
                                        className={
                                            activity.isRegistered
                                                ? styles.cancelButton
                                                : styles.joinButton
                                        }
                                        disabled={
                                            registrationPending !== null ||
                                            (
                                                activity.isFull &&
                                                !activity.isRegistered
                                            )
                                        }
                                        onClick={() =>
                                            toggleRegistration(activity)
                                        }
                                    >
                                        {registrationPending === activity.id
                                            ? "Updating..."
                                            : activity.isRegistered
                                                ? "Cancel Registration"
                                                : activity.isFull
                                                    ? "Event Full"
                                                    : "Join Event"}
                                    </button>

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

            {!registeredOnly && (
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
                                onFocus={(event) => {
                                    const now = new Date();
                                    now.setSeconds(0, 0);
                                    now.setMinutes(now.getMinutes() + 1);

                                    const localDate = new Date(
                                        now.getTime() -
                                        now.getTimezoneOffset() * 60000
                                    );

                                    event.currentTarget.min =
                                        localDate.toISOString().slice(0, 16);
                                }}
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
                                step={1}
                                placeholder="e.g., 12"
                            />

                            <p className={styles.helper}>
                                Optional. Leave blank for unlimited
                                participants. Registration closes when
                                the event reaches its maximum capacity.
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
            )}
        </main>
    );
}