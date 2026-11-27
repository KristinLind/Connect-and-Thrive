import { createNeonAuth } from "@neon/auth/next/server";
import { connection } from "next/server";

export const auth = createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL!,
    cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    },
});

// Retrieve authentication only during an actual request.
export async function getRequestSession() {
    await connection();

    return auth.getSession();
}