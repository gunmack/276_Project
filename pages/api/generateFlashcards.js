import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  const { targetLanguage } = req.body; // Get selected language from the request
  const geminiKey = process.env.GOOGLE_CLOUD_GEMINI_JULKAR;
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // prompt
  const prompt = `
  You are creating flashcards for a second-language student learning ${targetLanguage}.
  1. Pick a **random** word from ${targetLanguage}.
  2. Generate a **completely distinct and varied sentence** that uses this word naturally in context. The sentence should come from a variety of topics (e.g., weather, travel, hobbies, daily life, emotions, etc.), and should **avoid any repetition** of topics or themes from previous sentences.
  3. Do not use the same topic twice, and try to diversify the type of context for each sentence.
  4. Avoid repeating phrases, grammatical structures, or similar sentence patterns.
  5. Do not include the word "category" or mention the task. Only provide the generated sentence in ${targetLanguage}.
  6. Italian is a language and your response should be in italian if ${targetLanguage} is italian.
  7. Do not talk about cats, watches, mountains, or leaves if you talked about them last time.

`;


  try {
    const result = await model.generateContent(prompt);
    let generatedText = await result.response.text();
    generatedText = generatedText.replace(/\*\*/g, '');
    res.status(200).json({ generatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}