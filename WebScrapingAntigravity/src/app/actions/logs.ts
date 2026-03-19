"use server";

import { prisma } from "@/lib/prisma";

export async function createLog(data: { type: string, message: string, siteId?: string }) {
    return await prisma.log.create({
        data
    });
}

export async function getLogs(siteId?: string) {
    return await prisma.log.findMany({
        where: siteId ? { siteId } : {},
        include: {
            site: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100
    });
}

export async function clearLogs() {
    return await prisma.log.deleteMany({});
}
