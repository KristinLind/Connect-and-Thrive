import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { storage, PROFILE_PHOTO_BUCKET } from "@/lib/storage";

export async function POST(request: NextRequest) {
    try {
        const { data: session } = await auth.getSession();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Please sign in first." },
                { status: 401 }
            );
        }

        const authUserId = session.user.id;

        const access = await prisma.userAccess.findUnique({
            where: { authUserId },
        });

        if (
            !access ||
            (access.status !== "PENDING" &&
                access.status !== "APPROVED")
        ) {
            return NextResponse.json(
                { error: "Your account cannot upload a photograph." },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("photo");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Please choose a photograph." },
                { status: 400 }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Please upload a JPG, PNG, or WebP image." },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024 || file.size === 0) {
            return NextResponse.json(
                { error: "Photographs must be between 1 byte and 5 MB." },
                { status: 400 }
            );
        }

        const original = Buffer.from(await file.arrayBuffer());

        let optimized: Buffer;

        try {
            optimized = await sharp(original)
                .rotate()
                .resize(512, 512, {
                    fit: "cover",
                    position: "attention",
                })
                .webp({ quality: 80 })
                .toBuffer();
        } catch {
            return NextResponse.json(
                { error: "The selected file is not a valid image." },
                { status: 400 }
            );
        }

        const key = `member-profiles/${authUserId}/${crypto.randomUUID()}.webp`;

        await storage.send(
            new PutObjectCommand({
                Bucket: PROFILE_PHOTO_BUCKET,
                Key: key,
                Body: optimized,
                ContentType: "image/webp",
            })
        );

        const profile = await prisma.memberProfile.update({
            where: { authUserId },
            data: { photoUrl: key },
        });

        return NextResponse.json({
            success: true,
            photoUrl: profile.photoUrl,
            message: "Profile photograph uploaded successfully.",
        });
    } catch (error) {
        console.error("Profile photo upload failed:", error);

        return NextResponse.json(
            { error: "Unable to upload photograph." },
            { status: 500 }
        );
    }
}
