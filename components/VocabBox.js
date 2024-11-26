'use client';
import React, { useState, useEffect, useRef } from 'react';
import { firebaseDB } from '../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';
import { useAuth } from '../src/app/context/AuthContext';

const languageOptions = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'de', label: 'German' },
  { key: 'es', label: 'Spanish' }
];

// Utility function to decode HTML entities
const decodeHtmlEntities = (text) => {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(text, 'text/html').body
    .textContent;
  return decodedString;
};

export default function VocabBox() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(''); // Default target language
  const [translations, setTranslations] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(''); // State for generated content
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [Tloading, setTLoading] = useState(false);
  const [Gloading, setGLoading] = useState(false);
  const textareaRef = useRef(null);
  const { user } = useAuth();

  const getLanguageName = (languageCode) => {
    switch (languageCode) {
      case 'en':
        return 'English';
      case 'fr-FR':
        return 'French (French)';
      case 'fr-CA':
        return 'French (Canadian)';
      case 'fr':
        return 'French';
      case 'de':
        return 'German';
      case 'es':
        return 'Spanish';
      default:
        return 'Language not supported';
    }
  };

  useEffect(() => {
    // Clear translations on component mount (page reload)
    setTranslations([]);
    setTranslatedText('');
  }, []);

  const clear = async () => {
    setInputText('');
    setTranslations([]);
    setTranslatedText('');
    setDetectedLanguage('');

    setTargetLanguage('');
  };

  const addToVocab = async () => {
    const database = getDatabase(firebaseDB);
    const vocabCountRef = ref(database, `Users/${user.displayName}/VocabCount`);
    const count = await get(vocabCountRef);
    let newCount = 1;
    if (count.exists()) {
      newCount = count.val() + 1;
    }
    try {
      await set(vocabCountRef, newCount);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleTranslate() {
    if (!targetLanguage) {
      alert('Please select a target language.');
      return;
    }
    if (!inputText.trim()) {
      alert('Please enter some text to translate.');
      return;
    }
    try {
      setTLoading(true);
      const response = await fetch('/api/vocabTranslate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, targetLanguage })
      });
      const data = await response.json();
      const detectedLanguage = data.detectedSourceLanguage;
      const rawTranslations = data.translations;
      // Decode HTML entities in the translations
      const decodedTranslations = rawTranslations.map((text) =>
        decodeHtmlEntities(text)
      );
      setDetectedLanguage(getLanguageName(detectedLanguage)); // Save detected language
      setTranslations(decodedTranslations); // Save decoded translations
      setTranslatedText(decodedTranslations[0]); // Set the first translation
      addToVocab(); // Prevent further clicks
    } catch (error) {
      console.error(error);
      alert('An error occurred during translation.');
    } finally {
      setTLoading(false); // Reset loading state
    }
  }

  async function callGemini() {
    try {
      setInputText(''); // Clear input text
      setTranslations([]); // Clear translations
      setTranslatedText(''); // Clear translated text
      setGLoading(true);
      const response = await fetch('/api/generateVocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      let generatedText = data.generatedText;
      setInputText(generatedText); // Update input text with generated content
      setGeneratedContent(generatedText); // Update state with generated content
    } catch (error) {
      console.error(error);
      alert('An error occurred while asking Gemini.');
    } finally {
      setGLoading(false); // Reset loading state
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    }
  }, [inputText]);

  return (
    <>
      <div data-testid="Vocab Box" className="vocab-box">
        {!translatedText && (
          <div>
            <label htmlFor="languageSelect">Translate to: </label>
            <select
              id="languageSelect"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="" disabled>
                Pick a language
              </option>
              {languageOptions.map((lang) => (
                <option key={lang.key} value={lang.key}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <br />

        <div className="vocab-text">
          {!translatedText && ( // Only render this div when `translatedText` is not present
            <div className="vocab-in">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="textarea"
                placeholder="Enter text here..."
                rows={10}
                cols={50}
              />
            </div>
          )}

          {translatedText && (
            <div>
              <div className="vocab-text">
                <div className="vocab-out">
                  <strong>Detected: {detectedLanguage}</strong>
                  <br />
                  <br />
                  <div className="no-list">{inputText}</div>
                </div>
                <div className="vocab-out">
                  <div>
                    <strong>
                      Translating to:{' '}
                      {languageOptions.find(
                        (lang) => lang.key === targetLanguage
                      )?.label || 'Unknown'}
                    </strong>
                    <br />
                    <br />
                    <ul className="no-list">
                      {translations.map((translation, index) => (
                        <li key={index}>{translation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <br />
        <div className="translate-button-container">
          {!translatedText && (
            <button
              onClick={handleTranslate}
              className="translate-button"
              disabled={Tloading || inputText == null}
            >
              {Tloading ? 'Translating...' : 'Translate'}
            </button>
          )}
          {!translatedText && (
            <button
              onClick={callGemini}
              className="translate-button"
              disabled={Gloading}
            >
              {Gloading ? 'Asking Gemini...' : 'Ask Google Gemini'}
            </button>
          )}
          {translatedText && (
            <button onClick={clear} className="clear-button">
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
}
