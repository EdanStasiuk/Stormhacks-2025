import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  text: string;
  raw?: any;
}

/**
 * Generate content using Gemini with a single prompt
 */
export async function generateContent(
  prompt: string,
  model: string = "gemini-2.5-flash-preview-05-20"
): Promise<GeminiResponse> {
  try {
    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      raw: response,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

/**
 * Generate structured JSON output using Gemini
 */
export async function generateJSON<T>(
  prompt: string,
  schema?: string,
  model: string = "gemini-2.5-flash-preview-05-20"
): Promise<T> {
  try {
    const fullPrompt = schema
      ? `${prompt}\n\nYou must respond with valid JSON matching this schema:\n${schema}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Ensure all strings are properly quoted and no trailing commas.`
      : `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown code blocks (no \`\`\`json), no explanations, no extra text. Ensure all strings are properly quoted and no trailing commas.`;

    const geminiModel = genAI.getGenerativeModel({
      model,
      generationConfig: {
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
      }
    });

    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks and formatting
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Remove any trailing commas before closing braces/brackets (common JSON error)
    text = text.replace(/,(\s*[}\]])/g, '$1');

    // Try to extract JSON if there's extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.error("Failed to parse JSON response:", text.substring(0, 500));
      throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Gemini JSON generation error:", error);
    throw error;
  }
}

/**
 * Multi-turn conversation with Gemini (for agentic workflows)
 */
export async function chat(
  messages: GeminiMessage[],
  model: string = "gemini-2.5-flash-preview-05-20"
): Promise<GeminiResponse> {
  try {
    const geminiModel = genAI.getGenerativeModel({ model });
    const chat = geminiModel.startChat({
      history: messages.slice(0, -1), // All but last message
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = await result.response;
    const text = response.text();

    return {
      text,
      raw: response,
    };
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw error;
  }
}

export default genAI;
