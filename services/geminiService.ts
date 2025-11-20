import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SocialPostContent, UploadedImage } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable is missing. Gemini service will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    twitter: {
      type: Type.OBJECT,
      properties: {
        content: {
          type: Type.STRING,
          description: "The tweet text, optimized for Twitter (concise, engaging, under 280 chars).",
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2-3 relevant hashtags.",
        },
      },
      required: ["content", "hashtags"],
    },
    xiaohongshu: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "Catchy, emotional, or intriguing title suitable for Xiaohongshu.",
        },
        content: {
          type: Type.STRING,
          description: "The main post body. Use emojis liberally, adopt a lifestyle/personal sharing tone, structure with clear line breaks.",
        },
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "5-10 relevant tags for discovery.",
        },
      },
      required: ["title", "content", "tags"],
    },
  },
  required: ["twitter", "xiaohongshu"],
};

export const generateSocialAdaptations = async (
  baseText: string,
  images: UploadedImage[],
  refineInstruction?: string
): Promise<SocialPostContent> => {
  if (!apiKey) {
    throw new Error("API Key not configured");
  }

  const model = "gemini-2.5-flash";

  let prompt = `
    You are an expert social media manager specializing in cross-platform content adaptation.
    
    TASK:
    Adapt the following user draft into two distinct social media posts:
    1. Twitter (X): Concise, witty, professional or casual (depending on context), under 280 characters.
    2. Xiaohongshu (Little Red Book): Lifestyle-oriented, emotional, emoji-rich, longer form, helpful, persuasive.
    
    USER DRAFT:
    "${baseText}"
    
    If images are provided, analyze them to add relevant descriptive details or mood to the posts.
  `;

  if (refineInstruction) {
    prompt += `
    
    REFINEMENT INSTRUCTION:
    The user wants to improve or modify the generated content with the following instruction:
    "${refineInstruction}"
    
    Please regenerate the content for both platforms, applying this instruction strictly while maintaining the platform-specific formats (Twitter length limits, Xiaohongshu tone).
    `;
  }

  const parts: any[] = [{ text: prompt }];

  // Add images if available
  images.forEach((img) => {
    if (img.base64Data) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.base64Data,
        },
      });
    }
  });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "Always return valid JSON adhering strictly to the schema.",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(responseText) as SocialPostContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
