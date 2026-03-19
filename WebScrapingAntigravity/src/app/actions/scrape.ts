"use server";

import { prisma } from "@/lib/prisma";
import { scrapeSite } from "@/lib/scraper";
import { detectSiteStructure, simplifyHtml, ScraperConfig } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { createLog } from "./logs";

export async function runScraper(siteId: string) {
    const site = await prisma.site.findUnique({
        where: { id: siteId },
    });

    if (!site) throw new Error("Site not found");

    const geminiKeyConfig = await prisma.appConfig.findUnique({
        where: { key: "GEMINI_API_KEY" },
    });

    if (!geminiKeyConfig) {
        await createLog({ type: 'ERROR', message: `Falha: API Key do Gemini não configurada.`, siteId });
        throw new Error("Gemini API Key not configured");
    }

    await prisma.site.update({
        where: { id: siteId },
        data: { status: "RUNNING" },
    });

    await createLog({ type: 'INFO', message: `Iniciando extração para o alvo: ${site.name}`, siteId });

    try {
        let config: ScraperConfig = JSON.parse(site.config);

        const proxy = site.proxyHost ? {
            server: `${site.proxyHost}:${site.proxyPort || '80'}`,
            username: site.proxyUser || undefined,
            password: site.proxyPass || undefined,
        } : undefined;

        // If config is empty or invalid, discover structure
        if (!config || !config.parentSelector) {
            await createLog({ type: 'GEMINI', message: `Analisando estrutura do site via Gemini AI...`, siteId });
            const { html } = await scrapeSite({ url: site.url, proxy });
            if (!html) throw new Error("Could not fetch site content");

            const cleanHtml = simplifyHtml(html);
            await createLog({ type: 'GEMINI', message: `Instruções enviadas: "${site.instructions}"`, siteId });
            config = await detectSiteStructure(cleanHtml, site.instructions, geminiKeyConfig.value);

            await prisma.site.update({
                where: { id: siteId },
                data: { config: JSON.stringify(config) },
            });
            await createLog({ type: 'GEMINI', message: `Estrutura detectada e salva com sucesso.`, siteId });
        }

        // Run actual extraction
        await createLog({ type: 'INFO', message: `Executando extração de dados via Playwright Engine...`, siteId });
        const { results } = await scrapeSite({ url: site.url, config, proxy });

        if (results) {
            await prisma.extraction.create({
                data: {
                    siteId,
                    data: JSON.stringify(results),
                },
            });
        }

        await prisma.site.update({
            where: { id: siteId },
            data: {
                status: "COMPLETED",
                lastRun: new Date()
            },
        });

        await createLog({ type: 'INFO', message: `Extração finalizada com sucesso. ${results?.length || 0} registros obtidos.`, siteId });

        revalidatePath("/");
        revalidatePath("/extractions");
        revalidatePath("/ai-logs");
        return { success: true, results };
    } catch (error: any) {
        await prisma.site.update({
            where: { id: siteId },
            data: { status: "FAILED" },
        });
        await createLog({ type: 'ERROR', message: `Erro na extração: ${error.message || "Desconhecido"}`, siteId });
        throw error;
    }
}

export async function addSite(
    name: string,
    url: string,
    instructions?: string,
    proxy?: { host?: string, port?: string, user?: string, pass?: string }
) {
    const site = await prisma.site.create({
        data: {
            name,
            url,
            instructions: instructions || undefined,
            proxyHost: proxy?.host,
            proxyPort: proxy?.port,
            proxyUser: proxy?.user,
            proxyPass: proxy?.pass,
        },
    });
    revalidatePath("/");
    return site;
}

export async function bulkAddSites(
    urls: string[],
    instructions?: string,
    proxy?: { host?: string, port?: string, user?: string, pass?: string }
) {
    const data = urls.map(url => {
        // Simple name from URL: https://example.com/foo -> Example
        let name = "Site";
        try {
            const domain = new URL(url).hostname;
            name = domain.replace('www.', '').split('.')[0];
            name = name.charAt(0).toUpperCase() + name.slice(1);
        } catch (e) { }

        return {
            name,
            url,
            instructions: instructions || undefined,
            proxyHost: proxy?.host,
            proxyPort: proxy?.port,
            proxyUser: proxy?.user,
            proxyPass: proxy?.pass,
        };
    });

    const result = await prisma.site.createMany({
        data,
    });

    revalidatePath("/");
    return result;
}

export async function updateSite(
    id: string,
    data: {
        name?: string,
        url?: string,
        instructions?: string,
        proxyHost?: string,
        proxyPort?: string,
        proxyUser?: string,
        proxyPass?: string
    }
) {
    // If instructions change, clear config to force re-detection
    const updateData: any = { ...data };
    if (data.instructions) {
        updateData.config = "{}";
    }

    const site = await prisma.site.update({
        where: { id },
        data: updateData,
    });
    revalidatePath("/");
    revalidatePath("/sites");
    return site;
}

export async function deleteSite(id: string) {
    // Delete related extractions first
    await prisma.extraction.deleteMany({
        where: { siteId: id }
    });
    // Delete logs
    await prisma.log.deleteMany({
        where: { siteId: id }
    });

    const result = await prisma.site.delete({
        where: { id }
    });
    revalidatePath("/");
    revalidatePath("/sites");
    return result;
}

export async function updateAppConfig(key: string, value: string) {
    const config = await prisma.appConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
    return config;
}
