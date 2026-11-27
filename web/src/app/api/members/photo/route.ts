import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { storage, PROFILE_PHOTO_BUCKET } from "@/lib/storage";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { connection } from "next/server";

export async function GET(request: Request) {
    // Member photographs require request-time authentication.
    await connection();

    try {
        // Only signed-in, approved members can view photographs
        const { data: session } = await auth.getSession();

        if (!session?.user) {
            return new Response("Sign in required.", { status: 401 });
        }

        const viewer = await prisma.userAccess.findUnique({
            where: { authUserId: session.user.id },
        });

        if (!viewer || viewer.status !== "APPROVED") {
            return new Response("Approved membership required.", {
                status: 403,
            });
        }

        // Identify the member whose photograph was requested
        const url = new URL(request.url);
        const memberId = url.searchParams.get("memberId");

        if (!memberId) {
            return new Response("Member ID required.", { status: 400 });
        }


        // Members can view their own photo even when their profile is private.
        // Other members can only view approved, shared profiles.
        const profile = await prisma.memberProfile.findFirst({
            where: {
                id: memberId,
                userAccess: {
                    status: "APPROVED",
                },
                OR: [
                    { authUserId: session.user.id },
                    { shareProfile: true },
                ],
            },
            select: {
                photoUrl: true,
            },
        });


        if (!profile?.photoUrl) {
            return new Response("Photograph not found.", {
                status: 404,
            });
        }

        const result = await storage.send(
            new GetObjectCommand({
                Bucket: PROFILE_PHOTO_BUCKET,
                Key: profile.photoUrl,
            })
        );

        if (!result.Body) {
            return new Response("Photograph not found.", {
                status: 404,
            });
        }

        const photoBytes = await result.Body.transformToByteArray();

        return new Response(new Uint8Array(photoBytes), {
            headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "private, no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("Member photo GET error:", error);

        return new Response("Unable to load photograph.", {
            status: 500,
        });
    }
}
