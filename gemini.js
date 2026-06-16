exports.handler = async (event) => {
  // CORS - تاکہ ویب سائٹ سے کال ہو جائے
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod!== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'POST کرو' }) };
  }

  try {
    const { message } = JSON.parse(event.body);
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Netlify میں GEMINI_API_KEY لگاؤ' })
      };
    }

    if (!message || message.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'میسج خالی ہے' })
      };
    }

    // Gemini API کال
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
          topP: 0.95
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'AI سوچ میں کھو گیا';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server Error: ' + error.message })
    };
  }
};
