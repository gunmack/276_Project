// pages/api/translate.js
import fetch from 'node-fetch';



// make the function to handle request and response
export default async function handler(req, res) {

  // make sure the request method is POST
  if (req.method === 'POST') {
    // destructures the req body grabbing the text and target language.
    const { text, targetLanguage } = req.body;

    // getting the APIKey form environment variables
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    //this is the request body that is being SENT to the google api
    const requestBody = {
      q: text,
      target: targetLanguage, // Target language passed from the frontend
    };


    try {
      // using fetch function to make POST request being sent to the Google Cloud Translation API
      const response = await fetch(url, {
        method: 'POST',
        // makes sure to show API we are sending it in JSON format
        headers: { 'Content-Type': 'application/json' },
        // the fetch expects it to be a string, so we turn the request body into a JSON string
        body: JSON.stringify(requestBody),
      });

      // stores the response into data
      const data = await response.json();

      // data.data ensures the property exists in the response
      // data.data.translations ensures that the translations array exists inside data
      // data.data.translations[0] ensures that the first translation result exists in the translations array
      if (data.data && data.data.translations && data.data.translations[0]) {
        // grabs the translated text from the API response
        const translatedText = data.data.translations[0].translatedText;
        // sends a 200OK respone back to client if the operation was sucessful and there was translatedText recieved from the API
        res.status(200).json({ success: true, translatedText });
      } else {
        // if not then return a 500 internal server error and provide an error message
        res.status(500).json({ success: false, error: 'Translation failed' });
      }
    } catch (error) {
      //catches any erorr that happens while trying to fetch data or process the response
      console.error('Error during translation:', error);

      // send a 500 internal server error
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    // the case where it is not a POST request 
    res.status(405).json({ message: 'Method not allowed' });
  }
}
