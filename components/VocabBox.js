'use client';
import React, { useState, useEffect, useRef } from 'react';
import { firebaseDB } from '../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';
import { useAuth } from '../src/app/context/AuthContext';

const languageOptions = [
  { key: 'en', label: 'English' },
  { key: 'fr-FR', label: 'French (French)' },
  { key: 'fr-CA', label: 'French (Canadian)' },
  { key: 'de', label: 'German' },
  { key: 'it', label: 'Italian' },
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
  const [Tloading, setTLoading] = useState(false);
  const [Gloading, setGLoading] = useState(false);
  const textareaRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Clear translations on component mount (page reload)
    setTranslations([]);
    setTranslatedText('');
  }, []);

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
      const rawTranslations = data.translations;
      // Decode HTML entities in the translations
      const decodedTranslations = rawTranslations.map((text) =>
        decodeHtmlEntities(text)
      );
      setTranslations(decodedTranslations); // Save decoded translations
      setTranslatedText(decodedTranslations[0]); // Set the first translation
      addToVocab();
    } catch (error) {
      console.error(error);
      alert('An error occurred during translation.');
    } finally {
      setTLoading(false); // Reset loading state
    }
  }

  async function callGemini() {
    try {
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
        <div>
          <button>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className=" language-dropdown"
            >
              <option value="" disabled>
                Translate to
              </option>
              <option value="en">English</option>
              <option value="fr-FR">French (French)</option>
              <option value="fr-CA">French (Canadian)</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="es">Spanish</option>
              {/* Add more language options as needed */}
            </select>
          </button>
        </div>
        <br />

        <div className="vocab-text">
          {!translatedText && ( // Only render this div when `translatedText` is not present
            <div className="vocab-in">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text"
                className="textarea"
                rows={10}
                cols={50}
              />
            </div>
          )}

          {translatedText && (
            <div>
              <div className="vocab-text">
                <div className="vocab-out">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text"
                    className="textarea"
                    cols={50}
                    rows={10}
                  />
                </div>
                <div className="vocab-out">
                  <div>
                    <strong>
                      Translating to{' '}
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
          <button
            onClick={handleTranslate}
            className="translate-button"
            disabled={Tloading}
          >
            {Tloading ? 'Translating...' : 'Translate'}
          </button>
          <button
            onClick={callGemini}
            className="translate-button"
            disabled={Gloading}
          >
            {Gloading ? 'Asking Gemini...' : 'Ask Google Gemini'}
          </button>
        </div>
      </div>
    </>
  );
}
