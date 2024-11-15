'use client';

import { useState } from 'react';

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export default function TextToSpeechBox() {
  const [text, setText] = useState(''); // State for input text
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [translatedText, setTranslatedText] = useState(''); // State for translated text
  const [selectedLanguage, setSelectedLanguage] = useState('fr'); // Default language is French

  const handleClick = async () => {
    if (!text.trim()) {
      alert('Please enter some text to synthesize.');
      return;
    }

    setIsLoading(true);

    try {
      // Translate the text to the selected language
      const translationResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, targetLanguage: selectedLanguage }),
      });

      const translationData = await translationResponse.json();

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

        const data = await response.json();

        if (data.success && data.audioContent) {
          const audioBuffer = Buffer.from(data.audioContent, 'base64');
          const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        } else {
          console.error('Error synthesizing speech:', data.error);
          alert('Failed to synthesize speech. Please try again.');
        }
      } else {
        console.error('Error translating text:', translationData.error);
        alert('Failed to translate text. Please try again.');
      }
    } catch (error) {
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
