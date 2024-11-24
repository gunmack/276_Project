'use client';
import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar';
import { useAuth } from '../context/AuthContext';
import { firebaseDB } from '../../../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';

function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

export default function Flashcards() {
  const { user } = useAuth();
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(''); // initialize language
  const [hasFlashCard, setHasFlashCard] = useState(false);
  const [hasTranslation, setHasTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const addToFlashCards = async () => {
    const database = getDatabase(firebaseDB);
    const FlashCardCountRef = ref(
      database,
      `Users/${user.displayName}/FlashCardCount`
    );
    const count = await get(FlashCardCountRef);
    let newCount = 1;
    if (count.exists()) {
      newCount = count.val() + 1;
    }
    try {
      await set(FlashCardCountRef, newCount);
    } catch (error) {
      console.error(error);
    }
  };

  async function generateNewFlashcard() {
    setError(null); // Reset error state
    setLoading(true); // Set loading state
    try {
      const response = await fetch('/api/generateFlashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLanguage }) // Send selected language to the API
      });

      const data = await response.json();

      console.log('API Response:', data); // Log the entire response to inspect it

      if (data.generatedText) {
        const generatedText = data.generatedText;

        // Check if generatedText is a valid string
        if (generatedText && typeof generatedText === 'string') {
          const sentences = generatedText
            .split('\n')
            .map((sentence) => sentence.trim());
          if (sentences.length > 0) {
            setCurrentFlashcard({
              original: sentences[0], // Take the first sentence for simplicity
              translation: '' // Placeholder for English translation
            });
            setHasFlashCard(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setError('Failed to generate a new flashcard');
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  async function handleTranslate() {
    setTranslating(true); // Set translating state
    if (!currentFlashcard) return;

    try {
      const response = await fetch('/api/vocabTranslate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText: currentFlashcard.original,
          targetLanguage: 'en'
        })
      });

      const data = await response.json();
      const translations = data.translations;

      // Decode HTML entities in the translated text
      const decodedText = decodeHtmlEntities(translations[0]);

      setCurrentFlashcard({
        ...currentFlashcard,
        translation: decodedText // Update with the decoded text
      });
      setHasTranslation(true);
      addToFlashCards();
    } catch (error) {
      console.error(error);
      setError('Failed to fetch translation');
    } finally {
      setTranslating(false); // Reset translating state
    }
  }

  return (
    <div
      data-testid="Flashcards"
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
    >
      <Toolbar />
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
        <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-5xl text-center mb-2">Flashcards</h1>
          <div className="grid grid-cols-1 gap-4 mb-2 w-full">
            <button>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="p-2 m-8 rounded-lg"
              >
                <option value="">Select a language</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="fr-FR">French (France)</option>
                <option value="fr-CA">French (Canada)</option>
                <option value="it">Italian</option>
                {/* Add more language options as needed */}
              </select>
            </button>
          </div>

          {currentFlashcard && (
            <div className="grid grid-cols-1 gap-4 mb-4 w-full">
              <div className="col-span-1 w-full h-80 flex justify-center items-center rounded-lg bg-white shadow-md">
                <div className="p-8 text-center">
                  <h2 className="text-xl font-bold">
                    {currentFlashcard.original}
                  </h2>
                  {currentFlashcard.translation && (
                    <p className="mt-4 text-lg text-gray-700">
                      {currentFlashcard.translation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-row p-12 m-12">
            {hasFlashCard && (
              <button
                onClick={handleTranslate}
                className="flashcard-button"
                disabled={translating || hasTranslation} // Disable if no flashcard is present
              >
                {translating ? 'Translating...' : 'Translate'}
              </button>
            )}
            <button
              onClick={generateNewFlashcard}
              className="flashcard-button"
              disabled={!targetLanguage || loading} // Disable if no language is selected or if loading is true
            >
              {loading ? 'Generating Flashcard...' : 'Generate Flashcard'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
