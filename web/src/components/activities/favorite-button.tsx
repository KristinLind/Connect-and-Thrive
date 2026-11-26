"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./favorite-button.module.css";

type FavoriteButtonProps = {
    activityId: string;
    initialSaved: boolean;
    removeOnly?: boolean;
};

export function FavoriteButton({
    activityId,
    initialSaved,
    removeOnly = false,
}: FavoriteButtonProps) {
    const router = useRouter();
    const [saved, setSaved] = useState(initialSaved);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    async function toggleFavorite() {
        setPending(true);
        setError("");

        try {
            const response = await fetch(
                `/api/activities/${encodeURIComponent(activityId)}/favorite`,
                {
                    method: saved ? "DELETE" : "POST",
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ?? "Could not update saved activity."
                );
                return;
            }

            setSaved(result.saved);
            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className={styles.container}>
            <button
                type="button"
                onClick={toggleFavorite}
                disabled={pending || (removeOnly && !saved)}
                aria-pressed={removeOnly ? undefined : saved}
                className={`${styles.button} ${
                    saved ? styles.saved : ""
                }`}
            >
                {pending
                    ? "Updating..."
                    : removeOnly
                    ? saved ? "Remove" : "Removed"
                    : saved
                    ? "Saved"
                    : "Save Activity"}
            </button>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}