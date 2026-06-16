
const chatBox =
  document.getElementById("chat-box") ||
  document.getElementById("chat-container");

const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Vercel backend route
const API_ENDPOINT = "/api/chat";

if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (userInput) {
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

async function sendMessage() {
  if (!chatBox || !userInput) {
    console.error("Required HTML elements not found.");
    return;
  }

  const message = userInput.value.trim();
  if (!message) return;

  // User message show karo
  addMessage(message, "user");
  userInput.value = "";

  // Loading message
  addMessage("...", "bot", "loading");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // Loading remove karo
    removeLoading();

    if (!response.ok) {
      addMessage("Error: " + (data.error || "Server error"), "bot");
      return;
    }

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("Error: jawab nahi mila", "bot");
    }
  } catch (error) {
    removeLoading();
    addMessage("Error: " + error.message, "bot");
    console.error("sendMessage error:", error);
  }
}

function addMessage(text, sender, type = "") {
  if (!chatBox) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender} ${type}`.trim();
  msgDiv.textContent = text;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoading() {
  const loading = document.querySelector(".loading");
  if (loading) loading.remove();
}
