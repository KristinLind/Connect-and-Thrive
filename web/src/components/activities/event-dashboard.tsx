"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ActivityRecord = { id: string; title: string; description: string; location: string; date: string; canDelete: boolean };

export function EventDashboard({ initialEvents }: { initialEvents: ActivityRecord[] }) {
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
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.get("title"), description: form.get("description"),
                    location: form.get("location"), date: new Date(String(form.get("date"))).toISOString(),
                }),
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) { setError(result?.error ?? "Could not save the activity."); return; }
            formElement.reset();
            router.refresh();
        } catch { setError("Could not connect to the server."); }
        finally { setPending(false); }
    }

    async function deleteEvent(id: string) {
        setError("");
        const response = await fetch(`/api/activities/${id}`, { method: "DELETE" });
        if (!response.ok) {
            const result = await response.json().catch(() => null);
            setError(result?.error ?? "Could not delete the activity.");
            return;
        }
        router.refresh();
    }

    return <main style={{ maxWidth: 900, margin: "32px auto", padding: 20 }}>
        <h1>Community events</h1>
        <p>Create and manage upcoming events with your community.</p>
        <form onSubmit={createEvent} style={{ display: "grid", gap: 12, maxWidth: 560, margin: "24px 0" }}>
            <label>Event name<input name="title" required maxLength={120} /></label>
            <label>Description<textarea name="description" required maxLength={5000} rows={4} /></label>
            <label>Location<input name="location" required maxLength={300} /></label>
            <label>Date and time<input name="date" type="datetime-local" required /></label>
            {error && <p role="alert">{error}</p>}
            <button disabled={pending}>{pending ? "Saving…" : "Create event"}</button>
        </form>
        <h2>Upcoming events</h2>
        {initialEvents.length === 0 ? <p>No upcoming events yet.</p> : <ul>
            {initialEvents.map((activity) => <li key={activity.id} style={{ marginBottom: 20 }}>
                <h3>{activity.title}</h3><p>{activity.description}</p>
                <p>{activity.location} · {new Date(activity.date).toLocaleString()}</p>
                {activity.canDelete && <button onClick={() => deleteEvent(activity.id)}>Delete event</button>}
            </li>)}
        </ul>}
    </main>;
}
