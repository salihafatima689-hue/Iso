import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ یہاں آپ نے اپنی گوگل اے آئی اسٹوڈیو والی API Key لکھنی ہے
const API_KEY = "process.env.GEMINI_API_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  // یہاں آپ کی وہی سسٹم انسٹرکشنز آ گئی ہیں جو آپ نے تصویر میں لکھی تھیں
  systemInstruction: "آپ میرے ذاتی اے آئی ہو آپ کا نام مارخور ہے اور آپ نے میرے لیے لائف ٹائم فری کام کرنا ہے...", 
});

window.sendMessage = async function() {
    const inputField = document.getElementById("user-input");
    const chatContainer = document.getElementById("chat-container");
    const text = inputField.value.trim();
    
    if (!text) return;

    // صارف کا میسج اسکرین پر دکھائیں
    chatContainer.innerHTML += `<div class="message user">${text}</div>`;
    inputField.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // اے آئی سے جواب مانگیں
        const result = await model.generateContent(text);
        const responseText = result.response.text();

        // اے آئی کا جواب اسکرین پر دکھائیں
        chatContainer.innerHTML += `<div class="message bot">${responseText}</div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        chatContainer.innerHTML += `<div class="message bot" style="color:red;">خرابی: کوڈ یا API Key چیک کریں۔</div>`;
    }
}
