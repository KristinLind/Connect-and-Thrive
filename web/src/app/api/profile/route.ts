import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

const allowedInterests = [
    "Outdoor Adventures",
    "Sports & Recreation",
    "Cooking Together",
    "Games & Social Nights",
    "Service Opportunities",
    "Learning & Friendship",
];

async function getProfileUser() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return { error: "Sign in required.", status: 401 };
    }

    const access = await prisma.userAccess.findUnique({
        where: { authUserId: session.user.id },
    });

    if (
        !access ||
        (access.status !== "PENDING" &&
            access.status !== "APPROVED")
    ) {
        return {
            error: "Profile access is not available for this account.",
            status: 403,
        };
    }

    return { userId: session.user.id };
}

// Retrieve the signed-in member's profile
export async function GET() {
    try {
        const result = await getProfileUser();

        if (!result.userId) {
            return Response.json(
                { error: result.error },
                { status: result.status ?? 403 }
            );
        }

        const profile = await prisma.memberProfile.findUnique({
            where: { authUserId: result.userId },
        });

        return Response.json({ profile });
    } catch (error) {
        console.error("Profile GET error:", error);

        return Response.json(
            { error: "Unable to load profile." },
            { status: 500 }
        );
    }
}

// Create or update the signed-in member's profile
export async function POST(request: Request) {
    try {
        const result = await getProfileUser();

        if (!result.userId) {
            return Response.json(
                { error: result.error },
                { status: result.status ?? 403 }
            );
        }

        const body = await request.json();

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return Response.json(
                { error: "Invalid profile information." },
                { status: 400 }
            );
        }

        const {
            displayName,
            location,
            occupation,
            bio,
            interests,
            storyTitle,
            story,
            storyType,
            shareProfile,
            shareStory,
            allowMessages,
        } = body;

        if (
            typeof displayName !== "string" ||
            !displayName.trim() ||
            displayName.trim().length > 80
        ) {
            return Response.json(
                { error: "Please enter a name of 1–80 characters." },
                { status: 400 }
            );
        }

        const optionalText = (
            value: unknown,
            maximum: number
        ): string | null | undefined => {
            if (value === undefined) return undefined;
            if (value === null || value === "") return null;
            if (
                typeof value !== "string" ||
                value.length > maximum
            ) {
                throw new Error("INVALID_FIELD");
            }
            return value.trim();
        };

        if (
            interests !== undefined &&
            (!Array.isArray(interests) ||
                interests.length > allowedInterests.length ||
                !interests.every(
                    (interest: unknown) =>
                        typeof interest === "string" &&
                        allowedInterests.includes(interest)
                ))
        ) {
            return Response.json(
                { error: "Please select valid activity interests." },
                { status: 400 }
            );
        }

        if (
            [shareProfile, shareStory, allowMessages].some(
                (value) =>
                    value !== undefined &&
                    typeof value !== "boolean"
            )
        ) {
            return Response.json(
                { error: "Invalid privacy settings." },
                { status: 400 }
            );
        }

        let fields;

        try {
            fields = {
                location: optionalText(location, 100),
                occupation: optionalText(occupation, 100),
                bio: optionalText(bio, 1000),
                storyTitle: optionalText(storyTitle, 150),
                story: optionalText(story, 5000),
                storyType: optionalText(storyType, 50),
            };
        } catch {
            return Response.json(
                { error: "One or more text fields are invalid." },
                { status: 400 }
            );
        }

        const profile = await prisma.memberProfile.upsert({
            where: { authUserId: result.userId },
            create: {
                authUserId: result.userId,
                displayName: displayName.trim(),
                location: fields.location ?? null,
                occupation: fields.occupation ?? null,
                bio: fields.bio ?? null,
                interests: interests ?? [],
                storyTitle: fields.storyTitle ?? null,
                story: fields.story ?? null,
                storyType: fields.storyType ?? null,
                shareProfile: shareProfile ?? false,
                shareStory: shareStory ?? false,
                allowMessages: allowMessages ?? false,
            },
            update: {
                displayName: displayName.trim(),
                ...fields,
                ...(interests !== undefined ? { interests } : {}),
                ...(shareProfile !== undefined
                    ? { shareProfile }
                    : {}),
                ...(shareStory !== undefined
                    ? { shareStory }
                    : {}),
                ...(allowMessages !== undefined
                    ? { allowMessages }
                    : {}),
            },
        });

        return Response.json({ profile });
    } catch (error) {
        console.error("Profile POST error:", error);

        return Response.json(
            { error: "Unable to save profile." },
            { status: 500 }
        );
    }
}
