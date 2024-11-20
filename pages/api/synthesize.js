// pages/api/synthesize.js
import fetch from 'node-fetch';

// make function that handles requests (incoming HTTP Request) and response (used to send data back to the client)
export default async function handler(req, res) {
  // checks if the HTTP request method is POST because this function only handles with POST requests which is sending data from a server
  if (req.method === 'POST') {
    // takes only the text out of the req.body
    const { text } = req.body;

    // get the api key from the environment variables
    const apiKey = process.env.GOOGLE_CLOUD_TEXT_TO_SPEECH_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    // defines a mapping of languages to their corresponding voice.
    // all gender is neutral
    const voiceMap = {
      fr: { languageCode: 'fr-FR', ssmlGender: 'NEUTRAL' },
      de: { languageCode: 'de-DE', ssmlGender: 'NEUTRAL' },
      es: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
    };

    // extracts the language property and defaults to french if nothing is chosen 
    const selectedLanguage = req.body.language || 'fr'; 
    // looks up voice config for ur selected language in the voice map and plays it
    const voice = voiceMap[selectedLanguage] || voiceMap['fr'];

    // this is what is sent to the google cloud API
    const requestBody = {
      // the text that is written
      input: { text: text },
      // the languag voice we've chosen
      voice: voice,
      // and we want it in MP3
      audioConfig: { audioEncoding: 'MP3' },
    };

    // making a POST request to the Goggle Cloud using the fetch function.
    try {
      const response = await fetch(url, {
        method: 'POST',
        // tells api that we are sending the request in JSON Format
        headers: { 'Content-Type': 'application/json' },
        // the fetch expects it to be a string, so we turn the request body into a JSON string
        body: JSON.stringify(requestBody),
      });

      // stores the response form the api into data
      const data = await response.json();

      // checking if the audio exists in the API response  
      if (data.audioContent) {
        //if it is send the 200OK response with audio
        res.status(200).json({ success: true, audioContent: data.audioContent });
      } else {
        // if not sned the 500 internal server error
        res.status(500).json({ success: false, error: data.error });
      }
      // catches an error that happens during the API request and send the 500 internal server error with an error mesage
    } catch (error) {
      console.error('Error during TTS synthesis:', error);
      res.status(500).json({ success: false, error: error.message });
    }
    //this handles the case where the request method is not POST. so it sends a 405 method not allowed.
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
