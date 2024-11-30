import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { inputText, targetLanguage } = req.body;

  const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_JULKAR;
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  if (!inputText) {
    return res.status(400).json({ error: 'inputText is required' });
  }

  if (!targetLanguage) {
    return res.status(400).json({ error: 'targetLanguage is required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing or invalid' });
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

    if (!data || !data.data || !data.data.translations) {
      return res
        .status(500)
        .json({ error: 'Unexpected response format from translation API' });
    }
    const translations = data.data.translations.map((t) => t.translatedText);
    res.status(200).json({ translations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
