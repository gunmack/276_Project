import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Global variable to store used words
let usedWords = new Set();

export default async function handler(req, res) {
  const { targetLanguage } = req.body; // Get selected language from the request
  const geminiKey = process.env.GOOGLE_CLOUD_GEMINI_JULKAR;
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Prompt
  const prompt = `
  You are creating flashcards for a second-language student learning ${targetLanguage}.
  1. Pick a **random** word from ${targetLanguage}.
  2. Generate a **completely distinct and varied sentence** that uses this word naturally in context. The sentence should come from a variety of topics (e.g., weather, travel, hobbies, daily life, emotions, etc.), and should **avoid any repetition** of topics or themes from previous sentences.
  3. Do not use the same topic twice, and try to diversify the type of context for each sentence.
  4. Avoid repeating phrases, grammatical structures, or similar sentence patterns.
  5. Do not include the word "category" or mention the task. Only provide the generated sentence in ${targetLanguage}.
  6. Italian is a language and your response should be in italian if ${targetLanguage} is italian.

  Make sure the word has not been picked previously in this session. The list of previously used words is: ${Array.from(usedWords).join(', ')}.
  `;

  try {
    const result = await model.generateContent(prompt);
    let generatedText = await result.response.text();
    generatedText = generatedText.replace(/\*\*/g, '').trim();

    // Extract the word from the response (you may need to adjust this if the AI generates in a specific format)
    const extractedWord = extractWord(generatedText);

    // Ensure the word is unique
    if (!usedWords.has(extractedWord)) {
      usedWords.add(extractedWord);
    } else {
      throw new Error(`The word "${extractedWord}" has already been used.`);
    }

    res.status(200).json({ generatedText, usedWords: Array.from(usedWords) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Helper function to extract the word from the generated response
function extractWord(sentence) {
  return sentence.split(' ')[0].toLowerCase();
}
