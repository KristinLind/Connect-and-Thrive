"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

const interestsList = [
    "Outdoor Adventures",
    "Sports & Recreation",
    "Cooking Together",
    "Games & Social Nights",
    "Service Opportunities",
    "Learning & Friendship",
];

type Profile = {
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

const initialProfile: Profile = {
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

const draftKey = "connect-thrive-registration-draft";

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    fontSize: "1rem",
    boxSizing: "border-box",
    background: "#fff",
    color: "#20364d",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    color: "#20364d",
    marginBottom: 7,
};

const sectionStyle: React.CSSProperties = {
    padding: 22,
    marginBottom: 28,
    border: "1px solid #dbe5e7",
    borderRadius: 12,
};

export function RegisterForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [accountCreated, setAccountCreated] = useState(false);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let draft: Record<string, unknown>;
        try {
            const saved = sessionStorage.getItem(draftKey);
            if (!saved) return;
            const parsed: unknown = JSON.parse(saved);
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
            draft = parsed as Record<string, unknown>;
        } catch {
            // Ignore invalid saved drafts.
            return;
        }

        const timeoutId = window.setTimeout(() => {
            if (draft.accountCreated === true) setAccountCreated(true);
            if (typeof draft.name === "string") setName(draft.name);
            if (typeof draft.email === "string") setEmail(draft.email);
            if (draft.profile && typeof draft.profile === "object") {
                setProfile({
                    ...initialProfile,
                    ...(draft.profile as Partial<Profile>),
                });
            }
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!preview) return;
        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    function updateProfile<K extends keyof Profile>(
        field: K,
        value: Profile[K]
    ) {
        setProfile((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function toggleInterest(interest: string) {
        setProfile((previous) => ({
            ...previous,
            interests: previous.interests.includes(interest)
                ? previous.interests.filter((item) => item !== interest)
                : [...previous.interests, interest],
        }));
    }

    function saveDraft(created: boolean) {
        try {
            sessionStorage.setItem(
                draftKey,
                JSON.stringify({
                    name,
                    email,
                    profile,
                    accountCreated: created,
                })
            );
        } catch {
            // Draft saving is optional.
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;

        setPending(true);
        setError("");
        setNotice("");

        let created = accountCreated;

        try {
            if (!created) {
                if (!name.trim() || !email.trim()) {
                    throw new Error("Please enter your name and email.");
                }

                if (password.length < 8) {
                    throw new Error(
                        "Password must contain at least 8 characters."
                    );
                }

                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                const result = await authClient.signUp.email({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                });

                if (result.error) {
                    throw new Error(
                        result.error.message ||
                        "Unable to create your account."
                    );
                }

                created = true;
                setAccountCreated(true);
                setPassword("");
                setConfirmPassword("");
                saveDraft(true);
            }

            const accessResponse = await fetch("/api/account/access", {
                method: "POST",
            });

            if (accessResponse.status === 401) {
                saveDraft(true);
                setNotice(
                    "Your account was created. Please sign in, then return here to finish your application."
                );
                return;
            }

            if (!accessResponse.ok) {
                throw new Error(
                    "Your account exists, but membership access could not be initialized. Please try Finish Application."
                );
            }

            const access = (await accessResponse.json()) as {
                status: "PENDING" | "APPROVED" | "BLOCKED";
                isAdmin: boolean;
            };

            if (access.status === "BLOCKED") {
                router.replace("/blocked");
                return;
            }

            const profileResponse = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            const profileData = await profileResponse.json();

            if (!profileResponse.ok) {
                throw new Error(
                    profileData.error ||
                    "Unable to save your profile. Please try Finish Application."
                );
            }

            if (photo) {
                const photoData = new FormData();
                photoData.append("photo", photo);

                const photoResponse = await fetch("/api/profile/photo", {
                    method: "POST",
                    body: photoData,
                });

                const photoResult = await photoResponse.json();

                if (!photoResponse.ok) {
                    throw new Error(
                        photoResult.error ||
                        "Your profile was saved, but the photograph could not be uploaded. Please try Finish Application."
                    );
                }
            }

            sessionStorage.removeItem(draftKey);

            const destination =
                access.status === "PENDING"
                    ? "/pending-approval"
                    : access.isAdmin
                        ? "/admin/review"
                        : "/profile/create";

            router.replace(destination);
            router.refresh();
        } catch (err) {
            saveDraft(created);
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setPending(false);
        }
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
                    maxWidth: 780,
                    margin: "0 auto",
                    background: "#fff",
                    padding: "35px",
                    borderRadius: 18,
                    boxShadow: "0 12px 30px rgba(32,54,77,0.12)",
                    borderTop: "6px solid #087b83",
                }}
            >
                <p
                    style={{
                        color: "#087b83",
                        fontWeight: 700,
                        letterSpacing: 2,
                        fontSize: "0.8rem",
                    }}
                >
                    CONNECT & THRIVE
                </p>

                <h1 style={{ color: "#20364d" }}>
                    {accountCreated
                        ? "Finish Your Application"
                        : "Join Our Community"}
                </h1>

                <p style={{ color: "#64748b", marginBottom: 30 }}>
                    Create your account and introduce yourself through
                    faith, friendship, service, and shared activities.
                    Your application remains private until approved.
                </p>

                <form onSubmit={handleSubmit}>
                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            Account Information
                        </h2>

                        <label htmlFor="register-name" style={labelStyle}>
                            Full Name *
                        </label>
                        <input
                            id="register-name"
                            style={inputStyle}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!profile.displayName) {
                                    updateProfile("displayName", e.target.value);
                                }
                            }}
                            disabled={accountCreated}
                            autoComplete="name"
                            required
                        />

                        <label
                            htmlFor="register-email"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            Email *
                        </label>
                        <input
                            id="register-email"
                            type="email"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={accountCreated}
                            autoComplete="email"
                            required
                        />

                        {!accountCreated && (
                            <>
                                <label
                                    htmlFor="register-password"
                                    style={{ ...labelStyle, marginTop: 18 }}
                                >
                                    Password *
                                </label>

                                <div style={{ position: "relative" }}>
                                    <input
                                        id="register-password"
                                        type={showPassword ? "text" : "password"}
                                        style={{ ...inputStyle, paddingRight: "55px" }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        aria-pressed={showPassword}
                                        title={showPassword ? "Hide password" : "Show password"}
                                        style={{
                                            position: "absolute",
                                            right: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#24564f",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: 6,
                                        }}
                                    >
                                        {showPassword ? (
                                            <svg width="22" height="22" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 5.1A11 11 0 0 1 12 5c5 0 9.3 3.1 11 7a12.5 12.5 0 0 1-4.1 5.2" />
                                                <path d="M6.2 6.2A12.4 12.4 0 0 0 1 12c1.7 3.9 6 7 11 7a11 11 0 0 0 5.8-1.6" />
                                                <path d="M10 10a3 3 0 0 0 4 4" />
                                            </svg>
                                        ) : (
                                            <svg width="22" height="22" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12s3.5 7 10 7 10-7 10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>


                                <label
                                    htmlFor="register-confirm"
                                    style={{ ...labelStyle, marginTop: 18 }}
                                >
                                    Confirm Password *
                                </label>

                                <div style={{ position: "relative" }}>
                                    <input
                                        id="register-confirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        style={{ ...inputStyle, paddingRight: "55px" }}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        minLength={8}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirmation password"
                                                : "Show confirmation password"
                                        }
                                        aria-pressed={showConfirmPassword}
                                        title={showConfirmPassword ? "Hide password" : "Show password"}
                                        style={{
                                            position: "absolute",
                                            right: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#24564f",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: 6,
                                        }}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="22" height="22" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 5.1A11 11 0 0 1 12 5c5 0 9.3 3.1 11 7a12.5 12.5 0 0 1-4.1 5.2" />
                                                <path d="M6.2 6.2A12.4 12.4 0 0 0 1 12c1.7 3.9 6 7 11 7a11 11 0 0 1 5.8-1.6" />
                                            </svg>
                                        ) : (
                                            <svg width="22" height="22" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12s3.5 7 10 7 10-7 10-7Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                            </>
                        )}
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            Profile Photograph
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            Add a photograph to help approved members
                            recognize you. JPG, PNG, or WebP, up to 5 MB.
                        </p>

                        {preview && (
                            <img
                                src={preview}
                                alt="Profile photograph preview"
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
                                const selected =
                                    event.target.files?.[0] ?? null;

                                if (selected && selected.size > 5 * 1024 * 1024) {
                                    setError("Photograph must be 5 MB or smaller.");
                                    setPhoto(null);
                                    setPreview(null);
                                    event.target.value = "";
                                    return;
                                }

                                setError("");
                                setPhoto(selected);
                                setPreview(
                                    selected
                                        ? URL.createObjectURL(selected)
                                        : null
                                );
                            }}
                        />
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            A Little About Me
                        </h2>

                        <label htmlFor="displayName" style={labelStyle}>
                            Display Name *
                        </label>
                        <input
                            id="displayName"
                            style={inputStyle}
                            maxLength={80}
                            value={profile.displayName}
                            onChange={(e) =>
                                updateProfile("displayName", e.target.value)
                            }
                            required
                        />

                        <label
                            htmlFor="location"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            Location
                        </label>
                        <input
                            id="location"
                            style={inputStyle}
                            maxLength={100}
                            placeholder="Example: Salt Lake City, Utah"
                            value={profile.location}
                            onChange={(e) =>
                                updateProfile("location", e.target.value)
                            }
                        />

                        <label
                            htmlFor="occupation"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            Occupation, Student Status, or Other
                        </label>
                        <input
                            id="occupation"
                            style={inputStyle}
                            maxLength={100}
                            placeholder="Example: College student, teacher, developer..."
                            value={profile.occupation}
                            onChange={(e) =>
                                updateProfile("occupation", e.target.value)
                            }
                        />

                        <label
                            htmlFor="bio"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            A Little About Me
                        </label>
                        <textarea
                            id="bio"
                            style={inputStyle}
                            rows={4}
                            maxLength={1000}
                            placeholder="Tell us a little about yourself..."
                            value={profile.bio}
                            onChange={(e) =>
                                updateProfile("bio", e.target.value)
                            }
                        />
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            Activities I Enjoy
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            Select as many as you like.
                        </p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(210px, 1fr))",
                                gap: 14,
                            }}
                        >
                            {interestsList.map((interest) => (
                                <label
                                    key={interest}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 9,
                                        color: "#20364d",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={profile.interests.includes(
                                            interest
                                        )}
                                        onChange={() =>
                                            toggleInterest(interest)
                                        }
                                    />
                                    {interest}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            My Story or Testimony
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            Optional: Share a personal experience,
                            a lesson learned, or something that has
                            strengthened your faith.
                        </p>

                        <label htmlFor="storyType" style={labelStyle}>
                            Story Type
                        </label>
                        <select
                            id="storyType"
                            style={inputStyle}
                            value={profile.storyType}
                            onChange={(e) =>
                                updateProfile("storyType", e.target.value)
                            }
                        >
                            <option>Personal Story</option>
                            <option>Testimony</option>
                            <option>Service Experience</option>
                            <option>Friendship Experience</option>
                        </select>

                        <label
                            htmlFor="storyTitle"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            Story Title
                        </label>
                        <input
                            id="storyTitle"
                            style={inputStyle}
                            maxLength={150}
                            value={profile.storyTitle}
                            onChange={(e) =>
                                updateProfile("storyTitle", e.target.value)
                            }
                        />

                        <label
                            htmlFor="story"
                            style={{ ...labelStyle, marginTop: 18 }}
                        >
                            My Story
                        </label>
                        <textarea
                            id="story"
                            style={inputStyle}
                            rows={6}
                            maxLength={5000}
                            value={profile.story}
                            onChange={(e) =>
                                updateProfile("story", e.target.value)
                            }
                        />
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={{ color: "#20364d", marginTop: 0 }}>
                            My Privacy Choices
                        </h2>

                        <p style={{ color: "#64748b" }}>
                            Your profile is private by default.
                            You decide what to share with other
                            approved members. You can change these
                            preferences later.
                        </p>

                        {([
                            [
                                "shareProfile",
                                "Show my profile to approved members",
                            ],
                            [
                                "shareStory",
                                "Share my story or testimony",
                            ],
                            [
                                "allowMessages",
                                "Allow members to request contact",
                            ],
                        ] as const).map(([field, label]) => (
                            <label
                                key={field}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 14,
                                    color: "#20364d",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={profile[field]}
                                    onChange={(e) =>
                                        updateProfile(field, e.target.checked)
                                    }
                                />
                                {label}
                            </label>
                        ))}
                    </section>

                    {error && (
                        <p role="alert" style={{ color: "#b91c1c" }}>
                            {error}
                        </p>
                    )}

                    {notice && (
                        <div role="status">
                            <p style={{ color: "#087b83" }}>{notice}</p>
                            <Link
                                href="/sign-in"
                                style={{ color: "#087b83", fontWeight: 700 }}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        style={{
                            width: "100%",
                            background: pending ? "#64748b" : "#087b83",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            padding: "16px 28px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: pending ? "wait" : "pointer",
                        }}
                    >
                        {pending
                            ? "Submitting..."
                            : accountCreated
                                ? "Finish Application"
                                : "Submit Registration"}
                    </button>

                    <p
                        style={{
                            textAlign: "center",
                            marginTop: 22,
                            color: "#64748b",
                        }}
                    >
                        Already have an account?{" "}
                        <Link href="/sign-in" style={{ color: "#087b83" }}>
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
