import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
    }

    const user = session.user;
    const email = user.email.trim().toLowerCase();
    const name = user.name?.trim() || email.split("@")[0];

    const adminEmails = new Set(
        (process.env.ADMIN_EMAILS ?? "")
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    );

    const isBootstrapAdmin =
        user.emailVerified === true && adminEmails.has(email);

    const access = await prisma.userAccess.upsert({
        where: { authUserId: user.id },
        create: {
            authUserId: user.id,
            email,
            name,
            status: isBootstrapAdmin ? "APPROVED" : "PENDING",
            isAdmin: isBootstrapAdmin,
        },
        update: {
            email,
            name,
            ...(isBootstrapAdmin
                ? { status: "APPROVED", isAdmin: true }
                : {}),
        },
    });

    return Response.json({
        status: access.status,
        isAdmin: access.isAdmin,
    });
}