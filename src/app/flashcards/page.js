'use client';
import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar';

export default function Flashcards() {
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState(''); // initialize language

  async function generateNewFlashcard() {
    setError(null); // Reset error state
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
          }
        }
      }
    } catch (error) {
      console.error(error);
      setError('Failed to generate a new flashcard');
    }
  }

  async function handleTranslate() {
    if (!currentFlashcard) return;

    try {
      const response = await fetch('/api/vocabTranslate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText: currentFlashcard.original,
          targetLanguage: 'en'
        }) // Translate to English
      });

      const data = await response.json();
      const translations = data.translations;

      setCurrentFlashcard({
        ...currentFlashcard,
        translation: translations[0]
      });
    } catch (error) {
      console.error(error);
      setError('Failed to fetch translation');
    }
  }

  return (
    <div
      data-testid="Flashcards"
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      style={{
        background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
      }}
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
                <option value="fr-FR">French (French)</option>
                <option value="fr-CA">French (Canadian)</option>
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
            <button
              onClick={handleTranslate}
              className="p-2 m-2 bg-black text-white rounded-lg shadow-lg hover:bg-white hover:text-black"
              disabled={!currentFlashcard} // Disable if no flashcard is displayed
            >
              Translate to English
            </button>
            <button
              onClick={generateNewFlashcard}
              className="p-2 m-2 bg-black text-white rounded-lg shadow-lg hover:bg-white hover:text-black"
              disabled={!targetLanguage} // Disable if no language is selected
            >
              Generate Flashcard
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
