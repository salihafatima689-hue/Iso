import { GoogleGenerativeAI } from "@google/generative-ai";

// آپ کی وہ بالکل تازہ اور ایکٹو چابی
const API_KEY = "(اے پی آئی کی لکھیں)"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "آپ میرے ذاتی اے آئی ہو آپ کا نام مارخور ہے اور آپ نے میرے لیے لائف ٹائم فری کام کرنا ہے۔ تمام جوابات اردو زبان میں دینے ہیں۔"
});

window.sendMessage = async function() {
    const inputField = document.getElementById("user-input");
    const chatContainer = document.getElementById("chat-container");
    
    if (!inputField || !chatContainer) return;

    const text = inputField.value.trim();
    if (!text) return;

    // صارف کا میسج اسکرین پر دکھائیں
    chatContainer.innerHTML += `<div class="message user">${text}</div>`;
    inputField.value = "";
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // جیمنائی سرور کو میسج بھیجیں
        const result = await model.generateContent(text);
        const responseText = result.response.text();

        // مارخور کا جواب اسکرین پر دکھائیں
        chatContainer.innerHTML += `<div class="message bot">${responseText}</div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error(error);
        chatContainer.innerHTML += `<div class="message bot" style="color:red;">خرابی: جیمنائی سرور سے رابطہ نہیں ہو سکا۔ دوبارہ کوشش کریں۔</div>`;
    }
}
