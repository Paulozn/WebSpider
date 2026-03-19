"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function adminSetup(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) throw new Error("Preencha todos os campos");

    // Check if any user exists
    const userCount = await prisma.user.count();
    if (userCount > 0) throw new Error("O administrador já foi cadastrado");

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    await createSession(user.id);
    redirect("/");
}

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) throw new Error("Usuário não encontrado");

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new Error("Senha incorreta");

    await createSession(user.id);
    redirect("/");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}

export async function checkAdminExists() {
    const count = await prisma.user.count();
    return count > 0;
}
