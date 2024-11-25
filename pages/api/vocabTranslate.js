import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { inputText, targetLanguage } = req.body;

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
    const translations = data.data.translations.map((t) => t.translatedText);
    const detectedSourceLanguage =
      data.data.translations[0]?.detectedSourceLanguage;
    console.log(translations, detectedSourceLanguage);
    res.status(200).json({ translations, detectedSourceLanguage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
