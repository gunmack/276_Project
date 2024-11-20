'use client';

import { useState } from 'react';

// helper function it helps decode any HTML entities in the translated text so its a clean readable output.
function decodeHtmlEntities(text) {
  // makes a text area to perform decoding
  const textArea = document.createElement('textarea');

  textArea.innerHTML = text;
  return textArea.value;
}
// makes the function for the component
export default function TextToSpeechBox() {
  //stores the user's input text
  const [text, setText] = useState(''); 
  // tracks whether APIs are currently being called to show a loading state
  const [isLoading, setIsLoading] = useState(false); 
  //stores translated text recieved from API
  const [translatedText, setTranslatedText] = useState(''); 
  // tracks the currently selected language (default french)
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); 

  // this is the main function that is triggered when the user clicks "speak translated text"
  const handleClick = async () => {
    // if there is no text then send messaage saying please input text
    if (!text.trim()) {
      alert('Please enter some text to synthesize.');
      return;
    }

    //this displays the "synthesizing" while we are fetching the response from the API
    setIsLoading(true);

    try {
      // Translate the text to the selected language
      // sends a POST Request
      const translationResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //sends the text and target language to the API
        body: JSON.stringify({ text, targetLanguage: selectedLanguage }),
      });


      // gets the translation resposne and store it in translationData
      const translationData = await translationResponse.json();

      // checks if we actually got stuff back
      if (translationData.success && translationData.translatedText) {

        // Decode HTML entities in the translated text
        const decodedText = decodeHtmlEntities(translationData.translatedText);
        setTranslatedText(decodedText); // Update translated text state

        // Call the Text-to-Speech API with the translated text
        const response = await fetch('/api/synthesize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: decodedText }),
        });
        
        // gets response and stores it in data
        const data = await response.json();

        // checks if its a sucess
        if (data.success && data.audioContent) {
          // checking the audio stuff and playing it 
          const audioBuffer = Buffer.from(data.audioContent, 'base64');
          const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();

        } else {
          // otherwise give error if it was a problem with the data
          console.error('Error synthesizing speech:', data.error);
          alert('Failed to synthesize speech. Please try again.');
        }
      } else {
        // give error if it was problem translating
        console.error('Error translating text:', translationData.error);
        alert('Failed to translate text. Please try again.');
      }
    } catch (error) {
      // give error if we couldn't get the response or make request
      console.error('Error during fetch:', error);
      alert('Error during fetch. Please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <div className="text-to-speech-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Enter Text"
        className="text-input"
      />
      <br />
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="language-dropdown"
      >
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="es">Spanish</option>
      </select>
      <br />
      <button onClick={handleClick} disabled={isLoading} className="speak-button">
        {isLoading ? 'Synthesizing...' : 'Speak Translated Text'}
      </button>

      {/* Display box for translated text */}
      {translatedText && (
        <div className="translated-text-box">
          <h4>Translated Text:</h4>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}
