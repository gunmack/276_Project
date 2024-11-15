import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { inputText, targetLanguage } = req.body;

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_JULKAR;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: inputText,
        target: targetLanguage
      })
    });

    const data = await response.json();
    const translations = data.data.translations.map((t) => t.translatedText);
    res.status(200).json({ translations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
