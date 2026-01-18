import { GoogleGenAI, Type } from "@google/genai";
import { FormData, SajuResponse } from "../types";

export const generateSajuReading = async (formData: FormData, isUnlocked: boolean): Promise<SajuResponse> => {
  // 지침에 따라 process.env.API_KEY를 직접 사용합니다.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are K-Saju, a modern, edgy, MZ-style reading assistant.
    Tone: Provocative, Direct, "Risk-Avoidant", Casual, Young. English Language Only.
    Avoid: Mystical fluff, old-fashioned fortune-teller speech. English Only.
    
    CRITICAL: You MUST provide a JSON response exactly matching the schema.
    Prediction start: 2026.
    Pricing: $10.99 (Anchor) -> $5.00 (Discount).

    If LOVE mode: Provide detailed compatibility scores and 4 locked sections.
    If MONEY mode: Provide 2X longer, actionable career/wealth insights.
  `;

  const prompt = `Generate a detailed K-Saju reading for the following profile: ${JSON.stringify(formData)}. 
  If a finalQuestion is provided, address it directly in the free summary. Provide all data for both free and locked sections.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: { type: Type.STRING, description: "love or money" },
            free: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                one_liner: { type: Type.STRING },
              },
              required: ["headline", "one_liner"],
            },
            love_result: {
              type: Type.OBJECT,
              properties: {
                total_score: { type: Type.INTEGER },
                badge: { type: Type.STRING },
                summary: { type: Type.STRING },
                partner_instinctive_attraction: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    quote: { type: Type.STRING },
                    why: { type: Type.STRING },
                  },
                  required: ["title", "quote", "why"],
                },
                score_breakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      score: { type: Type.INTEGER },
                      tier: { type: Type.STRING },
                    },
                    required: ["label", "score", "tier"],
                  },
                },
                locked_sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      preview_quote: { type: Type.STRING },
                      content: { type: Type.STRING },
                    },
                    required: ["id", "title", "preview_quote"],
                  },
                },
              },
            },
            money_result: {
              type: Type.OBJECT,
              properties: {
                risk_map_title: { type: Type.STRING },
                free_timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      window: { type: Type.STRING },
                      theme: { type: Type.STRING },
                      best_action: { type: Type.STRING },
                      avoid: { type: Type.STRING },
                    },
                    required: ["window", "theme", "best_action", "avoid"],
                  },
                },
                free_insight: { type: Type.STRING },
                locked: {
                  type: Type.OBJECT,
                  properties: {
                    next_move_checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
                    danger_zones: { type: Type.ARRAY, items: { type: Type.STRING } },
                    highest_roi_habit: { type: Type.STRING },
                  },
                  required: ["next_move_checklist", "danger_zones", "highest_roi_habit"],
                },
              },
            },
            paywall: {
              type: Type.OBJECT,
              properties: {
                price_anchor: { type: Type.STRING },
                discount_price: { type: Type.STRING },
                cta: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                disclaimer: { type: Type.STRING },
                urgency: { type: Type.STRING },
              },
              required: ["price_anchor", "discount_price", "cta", "bullets", "disclaimer", "urgency"],
            },
            share_card: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                tagline: { type: Type.STRING },
                cta: { type: Type.STRING },
              },
              required: ["title", "subtitle", "tagline", "cta"],
            },
          },
          required: ["mode", "free", "paywall", "share_card"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text) as SajuResponse;
  } catch (error) {
    console.error("Gemini API Error", error);
    throw error;
  }
};