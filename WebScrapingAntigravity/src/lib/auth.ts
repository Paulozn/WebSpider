import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "antigravity-secret-key-123");

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(SECRET);

    (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
    });
}

export async function getSession() {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as { userId: string };
    } catch {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete("session");
}
