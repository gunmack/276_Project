import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { inputText, targetLanguage } = req.body;

  if (!inputText || !targetLanguage) {
    return res.status(400).json({
      error: 'inputText and targetLanguage are required.'
    });
  }

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_JULKAR;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

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

    if (!data.data || !data.data.translations) {
      throw new Error('Unexpected response from translation API');
    }

    const translations = data.data.translations.map((t) => t.translatedText);
    const detectedSourceLanguage =
      data.data.translations[0]?.detectedSourceLanguage;
    res.status(200).json({ translations, detectedSourceLanguage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
