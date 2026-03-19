import { GoogleGenAI } from "@google/genai";

export interface ScraperConfig {
  parentSelector: string;
  fields: {
    [key: string]: string; // Key: field name, Value: selector
  };
  paginationSelector?: string;
}

export async function detectSiteStructure(html: string, instructions: string, apiKey: string): Promise<ScraperConfig> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following simplified HTML structure and provide CSS selectors based on the user instructions.
    
    Instructions: "${instructions}"
    
    Simplified HTML:
    ${html}
    
    Return ONLY a JSON object with the following structure:
    {
      "parentSelector": "CSS selector for the container of the data. For single items or landing pages, use 'body' or a high-level container. For lists, use the common item container (e.g. '.product-card')",
      "fields": {
        "title": "CSS selector relative to parent (e.g. 'h2.title')",
        "price": "CSS selector relative to parent (e.g. '.price-value')",
        ... (any other relevant fields requested or detected)
      },
      "paginationSelector": "CSS selector for the 'Next' button if applicable"
    }

    IMPORTANT: 
    - If the user asks for multiple pieces of information spread across a landing page, use 'body' as the parentSelector.
    - If a field (like 'modules' or 'bonuses') contains multiple items, provide a selector that matches ALL of them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text || "";

    // Extract JSON from response (handling potential markdown formatting)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response or response was empty");

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("[Gemini API Error]:", error);
    throw new Error(`Gemini API failed: ${error.message || "Unknown error"}`);
  }
}

export function simplifyHtml(html: string): string {
  // Basic cleaning: remove scripts, styles, and redundant attributes
  // In a real implementation, we would use cheerio for better DOM manipulation
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/\s(style|onclick|on\w+)="[^"]*"/gi, "")
    .replace(/\s(data-\w+)="[^"]*"/gi, "");
}
