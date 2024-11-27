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
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(''); // Default target language
  const [translations, setTranslations] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(''); // State for generated content
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
    setInputText('');
    setOutputText('');
    setSourceLang('');
    setTargetLanguage('');
    setTranslations(null);
  }, []);

  const clear = async () => {
    setInputText('');
    setOutputText('');
    setDetectedLanguage('');
    setSourceLang('');
    setTargetLanguage('');
    setTranslations(null);
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
      setDetectedLanguage(getLanguageName(data.detectedLanguage)); // Save detected language
      setSourceLang(detectedLanguage); // Save detected language
      const rawTranslations = data.translations;
      // Decode HTML entities in the translations
      const decodedTranslations = rawTranslations.map((text) =>
        decodeHtmlEntities(text)
      ); // Save detected language
      setTranslations(decodedTranslations); // Save decoded translations
      setOutputText(decodedTranslations); // Set the first translation
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
      setTranslations(null); // Clear translations
      setOutputText(''); // Clear translated text
      setSourceLang(''); // Clear source language
      setGLoading(true);
      const response = await fetch('/api/generateVocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGeneratedContent(data.generatedText); // Save generated content
      setInputText(generatedContent); // Update input text with generated content
      // Update state with generated content
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

  const swapFields = () => {
    const temp = inputText;
    const tempLang = sourceLang;
    setInputText(outputText);
    setOutputText(temp);
    setSourceLang(targetLanguage);
    setTargetLanguage(tempLang);
  };

  return (
    <>
      <div data-testid="Vocab Box" className="vocab-box">
        <div className="vocab-text">
          {!translations && ( // Only render this div when `translatedText` is not present
            <div className="flex flex-1 gap-4">
              <div>
                <select
                  id="languageSelect"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="language-dropdown pb-4"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {languageOptions.map((lang) => (
                    <option key={lang.key} value={lang.key}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />
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

              <div>
                <select
                  id="languageSelect"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="language-dropdown pb-4"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {languageOptions.map((lang) => (
                    <option key={lang.key} value={lang.key}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />

                <textarea
                  ref={textareaRef}
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="textarea"
                  placeholder="Enter text here..."
                  rows={10}
                  cols={50}
                />
              </div>
            </div>
          )}

          {translations && (
            <div className="flex flex-1 gap-4">
              <div>
                <select
                  id="languageSelect"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="language-dropdown pb-4"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {languageOptions.map((lang) => (
                    <option key={lang.key} value={lang.key}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />
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

              <button onClick={swapFields} className="swap-button">
                Swap
              </button>

              <div>
                <select
                  id="languageSelect"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="language-dropdown pb-4"
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {languageOptions.map((lang) => (
                    <option key={lang.key} value={lang.key}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <br />
                <br />
                <textarea
                  ref={textareaRef}
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  className="textarea"
                  placeholder="Enter text here..."
                  rows={10}
                  cols={50}
                />
              </div>
            </div>
          )}
        </div>
        <br />
        <div className="translate-button-container">
          {!translations && (
            <button
              onClick={handleTranslate}
              className="translate-button"
              disabled={Tloading || inputText == null}
            >
              {Tloading ? 'Translating...' : 'Translate'}
            </button>
          )}
          {!translations && (
            <button
              onClick={callGemini}
              className="translate-button"
              disabled={Gloading}
            >
              {Gloading ? 'Asking Gemini...' : 'Ask Google Gemini'}
            </button>
          )}
          {translations && (
            <button onClick={clear} className="clear-button">
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
}
