"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type GroupManagementActionsProps = {
    groupId: string;
    name: string;
    description: string;
    meetingSchedule: string;
    location: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    updatedAt: string;
};

export function GroupManagementActions({
    groupId,
    name,
    description,
    meetingSchedule,
    location,
    status,
    updatedAt,
}: GroupManagementActionsProps) {
    const router = useRouter();

    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [groupName, setGroupName] = useState(name);
    const [groupDescription, setGroupDescription] =
        useState(description);
    const [groupSchedule, setGroupSchedule] =
        useState(meetingSchedule);
    const [groupLocation, setGroupLocation] =
        useState(location);

    const fieldStyle = {
        width: "100%",
        boxSizing: "border-box" as const,
        padding: 12,
        border: "1px solid #cbd5e1",
        borderRadius: 8,
        fontFamily: "inherit",
        fontSize: "1rem",
        marginTop: 6,
    };

    const primaryButton = {
        background: "#087b83",
        color: "#ffffff",
        border: "none",
        borderRadius: 8,
        padding: "12px 18px",
        fontWeight: 600,
        cursor: pending ? "wait" : "pointer",
    };

    const secondaryButton = {
        background: "#ffffff",
        color: "#087b83",
        border: "1px solid #087b83",
        borderRadius: 8,
        padding: "12px 18px",
        fontWeight: 600,
        cursor: pending ? "wait" : "pointer",
    };

    const deleteButton = {
        background: "#fff4f1",
        color: "#991b1b",
        border: "1px solid #fecaca",
        borderRadius: 8,
        padding: "12px 18px",
        fontWeight: 600,
        cursor: pending ? "wait" : "pointer",
    };

    function cancelEditing() {
        setGroupName(name);
        setGroupDescription(description);
        setGroupSchedule(meetingSchedule);
        setGroupLocation(location);
        setEditing(false);
        setError("");
    }

    async function saveGroup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (pending) return;

        setPending(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `/api/groups/${groupId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: groupName,
                        description: groupDescription,
                        meetingSchedule: groupSchedule,
                        location: groupLocation,
                        updatedAt,
                    }),
                },
            );

            const result = await response
                .json()
                .catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ??
                    "Could not update your group.",
                );
                return;
            }

            setSuccess(result.message);
            setEditing(false);
            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setPending(false);
        }
    }

    async function deleteGroup() {
        if (pending || !confirmDelete) return;

        setPending(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `/api/groups/${groupId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        confirm: true,
                        updatedAt,
                    }),
                },
            );

            const result = await response
                .json()
                .catch(() => null);

            if (!response.ok) {
                setError(
                    result?.error ??
                    "Could not delete your group.",
                );
                return;
            }

            setConfirmDelete(false);
            router.refresh();
        } catch {
            setError("Could not connect to the server.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                borderTop: "1px solid #dbe5e7",
                paddingTop: 18,
                marginTop: 16,
            }}
        >
            {editing ? (
                <form
                    onSubmit={saveGroup}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <h4 style={{ color: "#087b83", margin: 0 }}>
                        Update your group
                    </h4>

                    <label>
                        <strong>Group name</strong>
                        <input
                            value={groupName}
                            onChange={(event) =>
                                setGroupName(event.target.value)
                            }
                            maxLength={120}
                            required
                            disabled={pending}
                            style={fieldStyle}
                        />
                    </label>

                    <label>
                        <strong>Group description</strong>
                        <textarea
                            value={groupDescription}
                            onChange={(event) =>
                                setGroupDescription(
                                    event.target.value,
                                )
                            }
                            maxLength={5000}
                            rows={6}
                            required
                            disabled={pending}
                            style={{
                                ...fieldStyle,
                                resize: "vertical",
                            }}
                        />
                    </label>

                    <label>
                        <strong>Meeting schedule</strong>
                        <input
                            value={groupSchedule}
                            onChange={(event) =>
                                setGroupSchedule(
                                    event.target.value,
                                )
                            }
                            maxLength={500}
                            required
                            disabled={pending}
                            style={fieldStyle}
                        />
                    </label>

                    <label>
                        <strong>Location</strong>
                        <input
                            value={groupLocation}
                            onChange={(event) =>
                                setGroupLocation(
                                    event.target.value,
                                )
                            }
                            maxLength={300}
                            required
                            disabled={pending}
                            style={fieldStyle}
                        />
                    </label>

                    <div
                        style={{
                            background: "#f0f9f9",
                            color: "#087b83",
                            padding: 14,
                            borderRadius: 8,
                            lineHeight: 1.6,
                        }}
                    >
                        {status === "APPROVED"
                            ? "Your changes will require renewed administrator approval. Existing memberships will be preserved, but the group will temporarily be unavailable for discovery and new memberships."
                            : "Your updated group will be submitted for administrator review. Previous administrator feedback will remain available."}
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        style={primaryButton}
                    >
                        {pending
                            ? "Submitting..."
                            : "Resubmit for approval"}
                    </button>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={cancelEditing}
                        style={secondaryButton}
                    >
                        Cancel editing
                    </button>
                </form>
            ) : confirmDelete ? (
                <div
                    style={{
                        background: "#fff4f1",
                        border: "1px solid #fecaca",
                        padding: 16,
                        borderRadius: 10,
                        display: "grid",
                        gap: 12,
                    }}
                >
                    <strong style={{ color: "#991b1b" }}>
                        Permanently delete this group?
                    </strong>

                    <p>
                        This will remove the group and all
                        associated memberships. This action
                        cannot be undone.
                    </p>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={deleteGroup}
                        style={deleteButton}
                    >
                        {pending
                            ? "Deleting..."
                            : "Yes, delete group"}
                    </button>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirmDelete(false)}
                        style={secondaryButton}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            setEditing(true);
                        }}
                        style={primaryButton}
                    >
                        {status === "REJECTED"
                            ? "Edit and resubmit group"
                            : "Edit group"}
                    </button>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            setConfirmDelete(true);
                        }}
                        style={deleteButton}
                    >
                        Delete group
                    </button>
                </>
            )}

            {error && (
                <p role="alert" style={{ color: "#991b1b" }}>
                    {error}
                </p>
            )}

            {success && (
                <p role="status" style={{ color: "#166534" }}>
                    {success}
                </p>
            )}
        </div>
    );
}
