import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "change-this-secret-in-production");

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    const { pathname } = request.nextUrl;

    // Static and API routes skip
    if (pathname.includes("/_next") || pathname.includes("/api") || pathname.includes("/favicon.ico")) {
        return NextResponse.next();
    }

    // Public pages
    if (pathname === "/login" || pathname === "/setup") {
        if (session) {
            try {
                await jwtVerify(session, SECRET);
                return NextResponse.redirect(new URL("/", request.url));
            } catch (e) {
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    // Protection
    if (!session) {
        // We can't easily check DB here, so we redirect to /login.
        // The Login page will check if it needs to redirect to /setup.
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        await jwtVerify(session, SECRET);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
