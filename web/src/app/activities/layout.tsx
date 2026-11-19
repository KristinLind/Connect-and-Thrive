import type { ReactNode } from "react";
import { requireApprovedAccess } from "@/lib/auth/access";

export const instant = false;
export default async function ActivitiesLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    await requireApprovedAccess();
    return children;
}
