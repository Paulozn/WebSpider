import { chromium, Browser, Page } from "playwright";
import * as cheerio from "cheerio";
import { ScraperConfig } from "./gemini";

export interface ScrapingOptions {
    url: string;
    config?: ScraperConfig;
    proxy?: {
        server: string;
        username?: string;
        password?: string;
    };
}

export async function scrapeSite(options: ScrapingOptions) {
    const browser: Browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        proxy: options.proxy,
    });

    const page: Page = await context.newPage();

    try {
        await page.goto(options.url, { waitUntil: "networkidle", timeout: 60000 });

        // If no config provided, we just want the HTML for discovery
        if (!options.config) {
            const html = await page.content();
            await browser.close();
            return { html };
        }

        const html = await page.content();
        const $ = cheerio.load(html);
        const results: any[] = [];

        $(options.config.parentSelector).each((_, element) => {
            const item: any = {};
            for (const [fieldName, selector] of Object.entries(options.config!.fields)) {
                const els = $(element).find(selector);
                if (els.length > 1) {
                    item[fieldName] = els.map((_, el) => $(el).text().trim() || $(el).attr("src") || $(el).attr("href")).get();
                } else {
                    const el = els.first();
                    item[fieldName] = el.text().trim() || el.attr("src") || el.attr("href");
                }
            }
            results.push(item);
        });

        await browser.close();
        return { results };
    } catch (error) {
        await browser.close();
        throw error;
    }
}
