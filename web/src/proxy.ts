import { auth } from "@/lib/auth/server";

export default auth.middleware({
    loginUrl: "/sign-in",
    publicRoutes: [
        "/",
        "/register",
        "/sign-in",
        "/pending-approval",
        "/blocked",
        "/api/account/access",
        "/api/admin/access",
    ],
});

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};