
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Send بٹن + Enter دونوں سے کام کرے گا
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // تمہارا میسج chat میں
  addMessage(message, 'user');
  userInput.value = '';

  // Loading...
  const loadingId = addMessage('AI سوچ رہا ہے...', 'bot', 'loading');

  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    document.getElementById(loadingId).remove();
    
    if (data.reply) {
      addMessage(data.reply, 'bot'); // AI جواب آ گیا
    } else {
      addMessage('Error: ' + (data.error || 'جواب نہیں ملا'), 'bot');
    }
  } catch (error) {
    document.getElementById(loadingId).remove();
    addMessage('Error: ' + error.message, 'bot');
  }
}

function addMessage(text, sender, type = '') {
  const msgDiv = document.createElement('div');
  const msgId = 'msg-' + Date.now();
  msgDiv.id = msgId;
  msgDiv.className = `message ${sender} ${type}`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgId;
}
