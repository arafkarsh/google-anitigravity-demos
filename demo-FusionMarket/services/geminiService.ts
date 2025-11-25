import { GoogleGenAI, Chat } from "@google/genai";
import { Stock } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Initialize chat with a specific financial persona
let chatSession: Chat | null = null;

export const initializeChat = () => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return;
  }

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Nova (FuMa), a specialized financial market assistant.
      
      CORE DIRECTIVES:
      1. DOMAIN RESTRICTION: You must ONLY answer questions related to the Stock Market, Finance, Economics, and Trading.
         - If asked about anything else (e.g., general knowledge, coding, cooking, politics), politely refuse and state that you are restricted to financial topics.
      
      2. MODERATION & SAFETY:
         - You have ZERO TOLERANCE for abusive, hateful, or sexually explicit content.
         - If a user sends such a message, issue a strict warning: "Warning: Abusive or explicit content is not tolerated. Please maintain professional decorum."
         - Do not engage with the content of abusive messages.

      3. BEHAVIOR:
         - Provide concise, data-driven insights.
         - Do NOT provide personal financial advice (e.g., "Buy this"). Instead, analyze (e.g., "The data suggests...").
         - Keep answers brief and suitable for a chat sidebar.`,
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }
  if (!chatSession) return "AI service not configured. Please check API key.";

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

export interface AIStockAnalysis {
  summary: string;
  ceo: string;
  founded: string;
  founders: string;
  revenue: string;
  employees: string;
  revenuePerEmployee: string;
}

export const generateStockSummary = async (stock: Stock): Promise<AIStockAnalysis> => {
  const defaultAnalysis: AIStockAnalysis = {
    summary: "AI Summary unavailable.",
    ceo: "N/A",
    founded: "N/A",
    founders: "N/A",
    revenue: "N/A",
    employees: "N/A",
    revenuePerEmployee: "N/A"
  };

  if (!apiKey) return defaultAnalysis;

  try {
    const prompt = `Analyze ${stock.name} (${stock.symbol}) and provide a JSON response with the following fields:
    - summary: A brief, 2-sentence executive summary focusing on its sector (${stock.sector}) and business model.
    - ceo: Current CEO name.
    - founded: Year founded.
    - founders: Names of founders, comma separated.
    - revenue: Most recent annual revenue in Billions or Millions (e.g. "$383.3B" or "$500M").
    - employees: Total number of employees formatted with commas (e.g. "161,000").
    - revenuePerEmployee: Revenue per employee in thousands (e.g. "$250K" or "$1.2M").

    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "{}";
    // Clean up potential markdown code blocks if the model ignores instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(cleanText);

    return {
      summary: data.summary || "Summary unavailable.",
      ceo: data.ceo || "N/A",
      founded: data.founded || "N/A",
      founders: data.founders || "N/A",
      revenue: data.revenue || "N/A",
      employees: data.employees || "N/A",
      revenuePerEmployee: data.revenuePerEmployee || "N/A"
    };
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return defaultAnalysis;
  }
};
