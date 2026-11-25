import { getCurrentAccess } from "@/lib/auth/access";
import { getApiAccessFailure } from "@/lib/auth/api-access-policy";

export async function getApprovedApiAccess() {
    const current = await getCurrentAccess();

    const failure = getApiAccessFailure({
        signedIn: !!current,
        status: current?.access?.status ?? null,
    });
    if (failure) return { response: Response.json({ error: failure.error }, { status: failure.status }), access: null };

    return { response: null, access: current?.access ?? null };
}

export async function getAdminApiAccess() {
    const current = await getApprovedApiAccess();
    if (current.response) return { response: current.response, access: null };
    const failure = getApiAccessFailure({ signedIn: true, status: "APPROVED", isAdmin: current.access?.isAdmin, requireAdmin: true });
    if (failure) return { response: Response.json({ error: failure.error }, { status: failure.status }), access: null };
    return { response: null, access: current.access };
}
