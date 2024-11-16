// pages/api/translate.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, targetLanguage } = req.body;

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const requestBody = {
      q: text,
      target: targetLanguage // Target language passed from the frontend
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.data && data.data.translations && data.data.translations[0]) {
        const translatedText = data.data.translations[0].translatedText;
        res.status(200).json({ success: true, translatedText });
      } else {
        res.status(500).json({ success: false, error: 'Translation failed' });
      }
    } catch (error) {
      console.error('Error during translation:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
