import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  const geminiKey = process.env.GOOGLE_CLOUD_GEMINI_JULKAR;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }
  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `The user is a second language student.
  1. Then randomly pick a language: 
    - French  
    - German 
    - Spanish 
    - Italian
  2. Repeat step 1 two times.
  3. Pick a random word from the language. 
  4. Now generate a random sentence with that word.
  Do not include the language in the response. Do not include the category in the response.
  Only respond with your result. Ensure the response in 1 language only.`;

  try {
    const result = await model.generateContent(prompt);
    let generatedText = await result.response.text();
    generatedText = generatedText.replace(/\*\*/g, '');
    res.status(200).json({ generatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
