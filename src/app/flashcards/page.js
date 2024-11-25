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
  const [targetLanguage, setTargetLanguage] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // Track if flashcard is being generated
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
    setError(null);
    setIsGenerating(true); // Set generating state to true while loading
    setError(null); // Reset error state
    setLoading(true); // Set loading state
    setHasTranslation(false); // Reset translation state
    try {
      const response = await fetch('/api/generateFlashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLanguage })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.generatedText) {
        const generatedText = data.generatedText;
        if (generatedText && typeof generatedText === 'string') {
          const sentences = generatedText
            .split('\n')
            .map((sentence) => sentence.trim());
          if (sentences.length > 0) {
            setCurrentFlashcard({
              original: sentences[0],
              translation: ''
            });
            setHasFlashCard(true);
            setHasTranslation(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setError('Failed to generate a new flashcard');
    } finally {
      setIsGenerating(false); // Reset generating state when done
      setLoading(false);
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

      const decodedText = decodeHtmlEntities(translations[0]);

      setCurrentFlashcard({
        ...currentFlashcard,
        translation: decodedText
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
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to Flashcards!
              </h2>
              <p className="text-gray-700 mb-6">
                Use this feature to learn new phrases or reinforce your
                linguistic knowledge. Select a language from the dropdown menu
                and press "Generate Flashcard". After reading it, you can
                translate it to English with the push of a button.
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center items-center gap-4 font-[family-name:var(--font-geist-mono)]">
          <div className="grid grid-cols-1 gap-2 mb-2 w-full">
            <button>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="p-2 m-8 rounded-lg bg-black text-white"
              >
                <option value="">Select a language</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="it">Italian</option>
              </select>
            </button>
          </div>

          {/* Starting Flashcard */}
          {!currentFlashcard && (
            <div className="grid grid-cols-1 gap-4 mb-4 w-full">
              <div className="col-span-1 w-full h-80 flex justify-center items-center rounded-lg bg-white text-black shadow-md border-2 border-gray-400 min-w-[300px]">
                <div className="p-8 text-center">
                  <h2 className="text-xl font-bold">Welcome to Flashcards!</h2>
                  <p className="mt-4 text-lg text-black">
                    Select a language and press "Generate Flashcard" to get
                    started.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Flashcard */}
          {currentFlashcard && (
            <div className="grid grid-cols-1 gap-4 mb-4 w-full">
              <div className="col-span-1 w-full h-80 flex justify-center items-center rounded-lg bg-white border-2 border-gray-400 shadow-md min-w-[800px]">
                <div className="p-8 text-center">
                  <h2 className="text-xl font-bold">
                    {currentFlashcard.original}
                  </h2>
                  {currentFlashcard.translation && (
                    <p className="mt-4 text-lg text-gray-600">
                      {currentFlashcard.translation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="w-200 p-4 bg-white rounded-lg shadow-lg flex flex-col items-center">
            <button
              onClick={handleTranslate}
              className="flashcard-button"
              disabled={!currentFlashcard || hasTranslation}
            >
              {translating ? 'Translating...' : 'Translate to English'}
            </button>
            <button
              onClick={generateNewFlashcard}
              className={`p-2 m-2 rounded-lg shadow-lg ${!targetLanguage || isGenerating ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-black text-white hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black'}`}
              disabled={!targetLanguage || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Flashcard'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
