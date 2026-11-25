"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type StoryRecord = { id: string; authorId: string; title: string; content: string; status: "PENDING" | "APPROVED" | "REJECTED"; author: { name: string } };

export function StoryDashboard({ stories, userId }: { stories: StoryRecord[]; userId: string }) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function submitStory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError("");
        const formElement = event.currentTarget;
        const form = new FormData(formElement);
        try {
            const response = await fetch("/api/stories", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: form.get("title"), content: form.get("content") }),
            });
            const result = await response.json().catch(() => null);
            if (!response.ok) { setError(result?.error ?? "Could not submit the story."); return; }
            formElement.reset();
            router.refresh();
        } catch { setError("Could not connect to the server."); }
        finally { setPending(false); }
    }

    return <main style={{ maxWidth: 900, margin: "32px auto", padding: 20 }}>
        <h1>Community stories</h1>
        <p>Share an experience with the community. Stories are reviewed before they are published.</p>
        <form onSubmit={submitStory} style={{ display: "grid", gap: 12, maxWidth: 640, margin: "24px 0" }}>
            <label>Story title<input name="title" required maxLength={160} /></label>
            <label>Your story<textarea name="content" required maxLength={10000} rows={7} /></label>
            {error && <p role="alert">{error}</p>}
            <button disabled={pending}>{pending ? "Submitting…" : "Submit for review"}</button>
        </form>
        <h2>Stories</h2>
        {stories.length === 0 ? <p>No stories yet.</p> : stories.map((story) => <article key={story.id} style={{ borderTop: "1px solid #dbe5e7", padding: "16px 0" }}>
            <h3>{story.title}</h3><p>Shared by {story.author.name}</p><p style={{ whiteSpace: "pre-wrap" }}>{story.content}</p>
            {story.authorId === userId && <p>Review status: {story.status.toLowerCase()}</p>}
        </article>)}
    </main>;
}
