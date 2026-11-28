import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { isBootstrapAdmin } from "@/lib/auth/api-access-policy";

export async function POST() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return Response.json({ error: "Sign in required." }, { status: 401 });
    }

    const user = session.user;
    const email = user.email.trim().toLowerCase();
    const name = user.name?.trim() || email.split("@")[0];

    const isAdmin = isBootstrapAdmin(
        email,
        user.emailVerified === true,
        process.env.ADMIN_EMAILS ?? "",
    );

    const access = await prisma.userAccess.upsert({
        where: { authUserId: user.id },
        create: {
            authUserId: user.id,
            email,
            name,
            status: isAdmin ? "APPROVED" : "PENDING",
            isAdmin,
        },
        update: {
            email,
            name,
            ...(isAdmin
                ? { status: "APPROVED", isAdmin: true }
                : {}),
        },
    });

    return Response.json({
        status: access.status,
        isAdmin: access.isAdmin,
    });
}
