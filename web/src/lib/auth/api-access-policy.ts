export type AccessStatus = "PENDING" | "APPROVED" | "BLOCKED";
export type AdminAccessAction = "approve" | "block" | "unblock";

export type ApiAccessRequest = {
    signedIn: boolean;
    status?: AccessStatus | null;
    isAdmin?: boolean;
    requireAdmin?: boolean;
};

export function getApiAccessFailure(request: ApiAccessRequest) {
    if (!request.signedIn) return { status: 401, error: "Sign in required." } as const;
    if (request.status !== "APPROVED") {
        return {
            status: 403,
            error: request.status === "BLOCKED" ? "Account access is blocked." : "Account approval is pending.",
        } as const;
    }
    if (request.requireAdmin && !request.isAdmin) {
        return { status: 403, error: "Admin access required." } as const;
    }
    return null;
}

export function isBootstrapAdmin(
    email: string,
    emailVerified: boolean,
    configuredAdminEmails: string,
) {
    if (!emailVerified) return false;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return false;

    const allowedEmails = new Set(
        configuredAdminEmails
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
    );

    return allowedEmails.has(normalizedEmail);
}

export function getStatusForAdminAction(action: AdminAccessAction): AccessStatus {
    return action === "block" ? "BLOCKED" : "APPROVED";
}

export function canAccessProfile(status: AccessStatus | null) {
    return status === "PENDING" || status === "APPROVED";
}

export function getPostLoginDestination({
    status,
    isAdmin,
    hasProfile,
}: {
    status: AccessStatus;
    isAdmin: boolean;
    hasProfile: boolean;
}) {
    if (status === "BLOCKED") return "/blocked";
    if (status === "PENDING") {
        return hasProfile ? "/pending-approval" : "/register";
    }
    return isAdmin ? "/admin/review" : "/";
}

export function canManageOwnedResource(ownerId: string, userId: string, isAdmin: boolean) {
    return isAdmin || ownerId === userId;
}
