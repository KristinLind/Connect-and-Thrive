import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentAccess() {
    const { data: session } = await auth.getSession();

    if (!session?.user) {
        return null;
    }

    const access = await prisma.userAccess.findUnique({
        where: { authUserId: session.user.id },
    });

    return { session, access };
}

export async function requireApprovedAccess() {
    const current = await getCurrentAccess();

    if (!current) {
        redirect("/sign-in");
    }

    if (!current.access || current.access.status === "PENDING") {
        redirect("/pending-approval");
    }

    if (current.access.status === "BLOCKED") {
        redirect("/blocked");
    }

    return { ...current, access: current.access };
}

export async function requireAdminAccess() {
    const current = await requireApprovedAccess();

    if (!current.access.isAdmin) {
        redirect("/");
    }

    return current;
}