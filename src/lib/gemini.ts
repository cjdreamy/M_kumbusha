import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateCareInsights(context: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    return "Please configure your VITE_GEMINI_API_KEY in the .env file to see AI insights.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  try {
    const prompt = `As a caregiver assistant for the "M-Kumbusha" elderly care app, please analyze the following data and provide 2-3 actionable insights or comforting suggestions for the caregiver. Keep it brief and professional.

Context Data:
${context}

Important: Always include a brief disclaimer that this is AI-generated advice and not a substitute for professional medical consultation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return `AI Error: ${error.message || "Unknown error"}. Please check your API key, region support, or network.`;
  }
}
