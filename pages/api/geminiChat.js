import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { message, language, conversation } = req.body;

  if (!message || !language) {
    res.status(400).json({ error: 'Message and language are required.' });
    return;
  }

  try {
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const limitedHistory = conversation.slice(-10);
    const conversationHistory = limitedHistory
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join('\n');

    const prompt = `
      This is a conversation history:
      ${conversationHistory}

      User said: "${message}". 
      Respond as a helpful chatbot in ${language}. Do not provide multiple options, just give a single, direct response.
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: `Error: ${err.message}` });
  }
}
