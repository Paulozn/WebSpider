"use server";

import { prisma } from "@/lib/prisma";

export async function getAllExtractions() {
    return await prisma.extraction.findMany({
        include: {
            site: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}
