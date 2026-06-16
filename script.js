
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function scribe(text) {
  try {
    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error:", error);
    return "کچھ غلط ہو گیا، دوبارہ کوش کرو";
  }
}
