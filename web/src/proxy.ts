
import { auth } from "@/lib/auth/server";

export default auth.middleware({
    loginUrl: "/sign-in",
    publicRoutes: [
        "/",
        "/about",
        "/activities",
        "/activities/*",
        "/register",
        "/sign-in",
        "/pending-approval",
        "/blocked",
        "/api/account/access",
        "/api/admin/access",
        "/api/activities",
        "/api/activities/*",
        "/api/profile",
        "/api/profile/*",
        "/api/members/photo",
    ],
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
    ],
};
