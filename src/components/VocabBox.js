'use client';
import React, { useState, useEffect, useRef } from 'react';
import { firebaseDB } from '../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';
import { useAuth } from '../app/context/AuthContext';

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
  var [inputText, setInputText] = useState('');
  var [outputText, setOutputText] = useState('');
  var [sourceLang, setSourceLang] = useState('');
  var [targetLanguage, setTargetLanguage] = useState(''); // Default target language
  var [translations, setTranslations] = useState([]);
  var [generatedContent, setGeneratedContent] = useState(''); // State for generated content
  var [detectedLanguage, setDetectedLanguage] = useState('');
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
        return 'Language not supporte';
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    }
  }, [inputText]);

  useEffect(() => {
    // Clear translations on component mount (page reload)
    setInputText('');
    setOutputText('');
    setSourceLang('');
    setTargetLanguage('');
    setTranslations(null);
  }, []);

  async function swapFields() {
    var tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);

    var tempLang = sourceLang;
    setSourceLang(targetLanguage);
    setTargetLanguage(tempLang);
  }

  async function clearText() {
    setInputText('');
    setSourceLang('');
  }

  async function clear() {
    setInputText('');
    setOutputText('');
    setSourceLang('');
    setTargetLanguage('');
    setTranslations(null);
  }

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
    if (!inputText) {
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
      setSourceLang(detectedLanguage); // Save detected language
      setTranslations(decodedTranslations); // Save decoded translations
      if (translations === '') {
        alert('An error occurred during translation, please try again.');
        return;
      }
      setOutputText(decodedTranslations); // Display translations
      if (user) {
        addToVocab(); // Prevent further clicks
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during translation, please try again.');
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
      setTargetLanguage(''); // Clear target language
      setGLoading(true);
      const response = await fetch('/api/generateVocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGeneratedContent(data.generatedText); // Save generated content
      setInputText(generatedContent); // Update input text with generated content
      if (generatedContent === '') {
        alert('An error occurred while asking Gemini, please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while asking Gemini, please try again.');
    } finally {
      setGLoading(false); // Reset loading state
    }
  }

  return (
    <>
      <div data-testid="Vocab Box" className="vocab-box">
        <div className="vocab-text">
          <div className="flex flex-1 gap-4">
            <div>
              <select
                disabled={true}
                id="languageSelect"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="language-dropdown pb-4"
              >
                <option value="" disabled>
                  {sourceLang ? getLanguageName(sourceLang) : 'Detect language'}
                </option>
              </select>
              <br />
              <br />

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);

                  setTargetLanguage('');
                }}
                className="textarea"
                placeholder={
                  Gloading ? 'Asking Gemini... ' : 'Enter text to translate...'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Check if Enter key is pressed
                    e.preventDefault(); // Prevent default Enter key behavior (like newline in textarea)
                    handleTranslate(); // Call the translate function
                  }
                }}
                rows={10}
                cols={50}
              />
            </div>

            {inputText && (
              <button
                className="text-clear"
                onClick={clearText}
                aria-label="Clear text"
              >
                &times; {/* HTML entity for the "X" character */}
              </button>
            )}

            <button
              onClick={swapFields}
              aria-label="Swap fields"
              disabled={!outputText}
              className={`bg-emerald-300 h-1/3 mt-44 rounded-md p-1 
  ${outputText ? 'hover:bg-emerald-500' : 'opacity-50 cursor-not-allowed'}`}
            >
              <img
                src="data:image/png;base64,
                iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7klEQVR4
                nO2ZwQqDMBBE5/MqveRg8NB+fdK/sJAi5BAkVXOozazzYC+LBwfiZGcFhBBsDABiLgdiIoCUawYwwYCQxCzG5Zc3IWas
                iHkDeIKQUWIA3AG88ge32ODRfjq55j1rLh0jNPbPrmhFSDhyqy4P3Rr63R2t3vBfnOsBIrxEdIKzMqJECyJMjfFDYfVUFi
                uEEL/BFfumMlxRMa3Ghs1QwyIi7YUaFhEz243rlQc6wVsNNemk1U7LHm33CuhlvRMb+3aFuD8drdY9Wlj1q2gL3iujpf8T
                k4URZUsM5fRbE0M3/daCVWAOVkJclQ+6NrIaq+fhgAAAAABJRU5ErkJggg=="
                alt="sorting-arrows-horizontal"
              ></img>
            </button>

            <div>
              <select
                disabled={!inputText}
                id="languageSelect"
                value={targetLanguage}
                onChange={(e) => {
                  targetLanguage = e.target.value;

                  handleTranslate(setTargetLanguage(targetLanguage));
                }}
                className={`language-dropdown pb-4 ${
                  inputText ? '' : 'opacity-50 cursor-not-allowed' // Dim the dropdown if disabled
                }`}
              >
                <option value="" disabled>
                  Translate to
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
                disabled={true}
                ref={textareaRef}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                className="textarea"
                placeholder={
                  Tloading
                    ? 'Translating...'
                    : 'Translation will appear here...'
                }
                rows={10}
                cols={50}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="translate-button-container">
          <div> {Tloading ? 'Translating...' : ''}</div>

          <button
            onClick={callGemini}
            className="translate-button"
            disabled={Gloading}
          >
            {Gloading ? 'Asking Gemini...' : 'Ask Google Gemini'}
          </button>

          {translations && (
            <button onClick={clear} className="clear-button">
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}
