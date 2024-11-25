import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  const geminiKey = process.env.GOOGLE_CLOUD_GEMINI_JULKAR;
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  The user is a second language student. Follow these steps:

  1. Randomly select one of the following languages: 
    - French
    - German
    - Spanish

  2. Repeat step 1 to pick a second language.

  3. From the chosen language, randomly select a word.

  4. Generate a random sentence using that word.

  Ensure the response is in the chosen language only. Do not include the language name or category in your response. Only provide the generated sentence.
  `;

  try {
    const result = await model.generateContent(prompt);
    let generatedText = result.response.text();
    generatedText = generatedText.replace(/\*\*/g, '');
    res.status(200).json({ generatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
