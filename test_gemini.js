import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels(apiKey) {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // There isn't a direct listModels method in the SDK for web/frontend usually, 
        // it's more for the backend. However, we can try to probe.
        console.log("Probing connection with API Key...");

        // Test with a very basic prompt
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        const response = await result.response;
        console.log("Success! Model works.");
        return { success: true };
    } catch (error) {
        console.error("Probe failed:", error.message);
        return { success: false, error: error.message };
    }
}

const key = process.argv[2];
if (!key) {
    console.error("No API key provided");
    process.exit(1);
}

listModels(key);
