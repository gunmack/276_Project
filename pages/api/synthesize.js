// pages/api/synthesize.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    const apiKey = process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const voiceMap = {
      fr: { languageCode: 'fr-FR', ssmlGender: 'NEUTRAL' },
      de: { languageCode: 'de-DE', ssmlGender: 'NEUTRAL' },
      es: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
    };

    const selectedLanguage = req.body.language || 'fr'; // Default to French
    const voice = voiceMap[selectedLanguage] || voiceMap['fr'];

    const requestBody = {
      input: { text: text },
      voice: voice,
      audioConfig: { audioEncoding: 'MP3' },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.audioContent) {
        res.status(200).json({ success: true, audioContent: data.audioContent });
      } else {
        res.status(500).json({ success: false, error: data.error });
      }
    } catch (error) {
      console.error('Error during TTS synthesis:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
