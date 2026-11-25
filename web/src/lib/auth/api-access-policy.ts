export type AccessStatus = "PENDING" | "APPROVED" | "BLOCKED";

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

export function canManageOwnedResource(ownerId: string, userId: string, isAdmin: boolean) {
    return isAdmin || ownerId === userId;
}
