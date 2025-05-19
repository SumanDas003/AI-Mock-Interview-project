import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model:"models/gemini-1.5-flash", // ✅ Free-tier text model
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.9,
  topK: 50,
  maxOutputTokens: 2048, // Keep this reasonable for quota limits
  // ❌ responseModalities: ["text"] — remove this
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});
