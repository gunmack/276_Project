'use client';
import { useState, useEffect, useRef } from 'react';
// import { firebaseDB } from '../firebase_config';
// import { getDatabase, ref, get, set } from 'firebase/database';
import { addToVocab } from './comp_firebase';
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
  return parser.parseFromString(text, 'text/html').body.textContent;
};

export default function translate() {
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
    // Trigger handleTranslate whenever targetLanguage changes
    if (targetLanguage && inputText) {
      handleTranslate();
    }
  }, [targetLanguage]);

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
        addToVocab(user); // Prevent further clicks
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

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    sourceLang,
    setSourceLang,
    targetLanguage,
    setTargetLanguage,
    translations,
    Tloading,
    Gloading,
    clearText,
    clear,
    textareaRef,
    languageOptions,
    swapFields,
    handleTranslate,
    callGemini,
    getLanguageName
  };
}
