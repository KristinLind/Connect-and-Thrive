"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const activityInterests = [
    "Outdoor Adventures",
    "Sports & Recreation",
    "Cooking Together",
    "Games & Social Nights",
    "Service Opportunities",
    "Learning & Friendship",
];

type ProfileForm = {
    displayName: string;
    location: string;
    occupation: string;
    bio: string;
    interests: string[];
    storyTitle: string;
    story: string;
    storyType: string;
    shareProfile: boolean;
    shareStory: boolean;
    allowMessages: boolean;
};

const emptyProfile: ProfileForm = {
    displayName: "",
    location: "",
    occupation: "",
    bio: "",
    interests: [],
    storyTitle: "",
    story: "",
    storyType: "Personal Story",
    shareProfile: false,
    shareStory: false,
    allowMessages: false,
};

export default function CreateProfilePage() {
    const [form, setForm] = useState<ProfileForm>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [accessDenied, setAccessDenied] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [savedPhotoUrl, setSavedPhotoUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoMessage, setPhotoMessage] = useState("");
    const [profileExists, setProfileExists] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("/api/profile", {
                    cache: "no-store",
                });

                if (response.status === 401 || response.status === 403) {
                    setAccessDenied(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load your profile.");
                }

                const data = await response.json();

                if (data.profile) {
                    const profile = data.profile;
                    setProfileExists(true);

                    if (profile.photoUrl && profile.id) {
                        setSavedPhotoUrl(
                            `/api/members/photo?memberId=${encodeURIComponent(profile.id)}`
                        );
                    }

                    setForm({
                        displayName: profile.displayName ?? "",
                        location: profile.location ?? "",
                        occupation: profile.occupation ?? "",
                        bio: profile.bio ?? "",
                        interests: profile.interests ?? [],
                        storyTitle: profile.storyTitle ?? "",
                        story: profile.story ?? "",
                        storyType: profile.storyType ?? "Personal Story",
                        shareProfile: profile.shareProfile ?? false,
                        shareStory: profile.shareStory ?? false,
                        allowMessages: profile.allowMessages ?? false,
                    });
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    function updateField<K extends keyof ProfileForm>(
        field: K,
        value: ProfileForm[K]
    ) {
        setForm((previous) => ({ ...previous, [field]: value }));
        setMessage("");
    }

    function toggleInterest(interest: string) {
        setForm((previous) => ({
            ...previous,
            interests: previous.interests.includes(interest)
                ? previous.interests.filter((item) => item !== interest)
                : [...previous.interests, interest],
        }));
    }

    async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to save your profile.");
            }

            setMessage("Your profile has been saved successfully!");
            setProfileExists(true);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    }


    async function uploadPhoto() {
        if (!selectedPhoto) {
            setError("Please choose a photograph first.");
            return;
        }

        setUploadingPhoto(true);
        setError("");
        setPhotoMessage("");

        try {
            const photoData = new FormData();
            photoData.append("photo", selectedPhoto);

            const response = await fetch("/api/profile/photo", {
                method: "POST",
                body: photoData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ?? "Unable to upload photograph."
                );
            }

            setPhotoMessage(
                "Your profile photograph was saved successfully!"
            );
            setSelectedPhoto(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to upload photograph."
            );
        } finally {
            setUploadingPhoto(false);
        }
    }


    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "9px",
        fontSize: "1rem",
        boxSizing: "border-box",
    };

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontWeight: 600,
        color: "#20364d",
        marginBottom: "7px",
    };

    if (loading) {
        return <main style={{ padding: 40 }}>Loading your profile...</main>;
    }

    if (accessDenied) {
        return (
            <main style={{ padding: 40, textAlign: "center" }}>
                <h1>Member Access Required</h1>
                <p>Please sign in with an approved account to create a profile.</p>
                <Link href="/sign-in">Go to Sign In</Link>
            </main>
        );
    }

    return (
        <main
            style={{
                background: "#f8fafc",
                minHeight: "100vh",
                padding: "45px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    background: "#ffffff",
                    padding: "35px",
                    borderRadius: "18px",
                    boxShadow: "0 12px 30px rgba(32, 54, 77, 0.12)",
                    borderTop: "6px solid #087b83",
                }}
            >
                <p
                    style={{
                        color: "#087b83",
                        fontWeight: 700,
                        letterSpacing: "2px",
                        fontSize: "0.8rem",
                    }}
                >
                    CONNECT & THRIVE
                </p>

                <h1 style={{ color: "#20364d", marginBottom: 10 }}>
                    {profileExists ? "Edit My Profile" : "Create My Profile"}
                </h1>

                <p style={{ color: "#64748b", marginBottom: 30 }}>
                    Share a little about yourself and discover friendships through
                    faith, service, and activities.
                </p>

                <form onSubmit={saveProfile}>

                    <div
                        style={{
                            padding: 22,
                            marginBottom: 28,
                            background: "#f0f9f9",
                            border: "1px solid #cce7e8",
                            borderRadius: 12,
                        }}
                    >
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            Profile Photo
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            Add a photograph to help other approved members
                            recognize you. JPG, PNG, or WebP, up to 5 MB.
                        </p>

                        {(photoPreview || savedPhotoUrl) && (
                            <img
                                src={photoPreview || savedPhotoUrl || ""}
                                alt={
                                    photoPreview
                                        ? "New profile photograph preview"
                                        : "Your saved profile photograph"
                                }
                                style={{
                                    width: 140,
                                    height: 140,
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "4px solid #087b83",
                                    display: "block",
                                    marginBottom: 18,
                                }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                setSelectedPhoto(file);
                                setPhotoMessage("");

                                if (file) {
                                    setPhotoPreview(URL.createObjectURL(file));
                                } else {
                                    setPhotoPreview(null);
                                }
                            }}
                            style={{ marginBottom: 16, display: "block" }}
                        />

                        <button
                            type="button"
                            disabled={!selectedPhoto || uploadingPhoto || !profileExists}
                            onClick={uploadPhoto}
                            style={{
                                background: "#087b83",
                                color: "white",
                                border: "none",
                                borderRadius: 9,
                                padding: "12px 22px",
                                fontWeight: 700,
                                cursor: uploadingPhoto ? "wait" : "pointer",
                                opacity: !selectedPhoto || !profileExists ? 0.5 : 1,
                            }}
                        >
                            {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                        </button>

                        {!profileExists && (
                            <p style={{ color: "#64748b", fontSize: 14 }}>
                                Please save your basic profile before uploading a photo.
                            </p>
                        )}

                        {photoMessage && (
                            <p role="status" style={{ color: "#087b83" }}>
                                {photoMessage}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="displayName" style={labelStyle}>
                            Display Name *
                        </label>
                        <input
                            id="displayName"
                            required
                            maxLength={80}
                            style={inputStyle}
                            value={form.displayName}
                            onChange={(event) =>
                                updateField("displayName", event.target.value)
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="location" style={labelStyle}>
                            Location (optional)
                        </label>
                        <input
                            id="location"
                            maxLength={100}
                            placeholder="Example: Salt Lake City, Utah"
                            style={inputStyle}
                            value={form.location}
                            onChange={(event) =>
                                updateField("location", event.target.value)
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="occupation" style={labelStyle}>
                            Occupation or Interests (optional)
                        </label>
                        <input
                            id="occupation"
                            maxLength={100}
                            style={inputStyle}
                            value={form.occupation}
                            onChange={(event) =>
                                updateField("occupation", event.target.value)
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="bio" style={labelStyle}>
                            A Little About Me
                        </label>
                        <textarea
                            id="bio"
                            rows={4}
                            maxLength={1000}
                            style={inputStyle}
                            placeholder="Tell us about yourself..."
                            value={form.bio}
                            onChange={(event) =>
                                updateField("bio", event.target.value)
                            }
                        />
                    </div>

                    <fieldset
                        style={{
                            border: "1px solid #dbe5e7",
                            borderRadius: 12,
                            padding: 20,
                            marginBottom: 25,
                        }}
                    >
                        <legend
                            style={{
                                fontWeight: 700,
                                color: "#087b83",
                                padding: "0 8px",
                            }}
                        >
                            Activities I Enjoy
                        </legend>

                        <p style={{ color: "#64748b", marginBottom: 15 }}>
                            Select as many as you like.
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                                gap: 14,
                            }}
                        >
                            {activityInterests.map((interest) => (
                                <label
                                    key={interest}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 9,
                                        color: "#20364d",
                                        cursor: "pointer",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.interests.includes(interest)}
                                        onChange={() => toggleInterest(interest)}
                                    />
                                    {interest}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <h2 style={{ color: "#20364d", marginBottom: 15 }}>
                        My Story or Testimony
                    </h2>

                    <p style={{ color: "#64748b", marginBottom: 20 }}>
                        This section is optional. Share an experience, a lesson
                        learned, or something that has strengthened your faith.
                    </p>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="storyType" style={labelStyle}>
                            Story Type
                        </label>
                        <select
                            id="storyType"
                            style={inputStyle}
                            value={form.storyType}
                            onChange={(event) =>
                                updateField("storyType", event.target.value)
                            }
                        >
                            <option>Personal Story</option>
                            <option>Testimony</option>
                            <option>Service Experience</option>
                            <option>Friendship Experience</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label htmlFor="storyTitle" style={labelStyle}>
                            Story Title
                        </label>
                        <input
                            id="storyTitle"
                            maxLength={150}
                            style={inputStyle}
                            value={form.storyTitle}
                            onChange={(event) =>
                                updateField("storyTitle", event.target.value)
                            }
                        />
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <label htmlFor="story" style={labelStyle}>
                            My Story
                        </label>
                        <textarea
                            id="story"
                            rows={6}
                            maxLength={5000}
                            style={inputStyle}
                            value={form.story}
                            onChange={(event) =>
                                updateField("story", event.target.value)
                            }
                        />
                    </div>

                    <h2 style={{ color: "#20364d", marginBottom: 15 }}>
                        My Privacy Choices
                    </h2>

                    <p style={{ color: "#64748b", marginBottom: 18 }}>
                        Your profile is private by default. You decide what to share
                        with other approved members.
                    </p>

                    {([
                        ["shareProfile", "Show my profile to approved members"],
                        ["shareStory", "Share my story or testimony"],
                        ["allowMessages", "Allow members to request contact"],
                    ] as const).map(([field, label]) => (
                        <label
                            key={field}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 14,
                                color: "#20364d",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={form[field]}
                                onChange={(event) =>
                                    updateField(field, event.target.checked)
                                }
                            />
                            {label}
                        </label>
                    ))}

                    {error && (
                        <p role="alert" style={{ color: "#b91c1c", marginTop: 20 }}>
                            {error}
                        </p>
                    )}

                    {message && (
                        <p role="status" style={{ color: "#087b83", marginTop: 20 }}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            background: "#087b83",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            padding: "14px 28px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: saving ? "wait" : "pointer",
                            marginTop: 22,
                            width: "100%",
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : profileExists
                                ? "Save Changes"
                                : "Create My Profile"}
                    </button>

                    <p style={{ textAlign: "center", marginTop: 22 }}>
                        <Link href="/members" style={{ color: "#087b83" }}>
                            Back to Meet Our Members
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
