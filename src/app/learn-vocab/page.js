'use client';
import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LearnVocab() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default target language
  const [translations, setTranslations] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(''); // State for generated content
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth'); // Redirect to login page if not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    // Clear translations on component mount (page reload)
    setTranslations([]);
    setTranslatedText('');
  }, []);

  async function handleTranslate() {
    setError(null); // Reset error state
    try {
      const response = await fetch('/api/vocabTranslate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, targetLanguage })
      });

      const data = await response.json();
      const translations = data.translations;
      setTranslations(translations);
      setTranslatedText(translations[0]);
    } catch (error) {
      console.error(error);
    }
  }

  async function callGemini() {
    setError(null); // Reset error state
    try {
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
    }
  }

  return (
    <>
      <div
        data-testid="Learn Vocab"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
        style={{
          background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
        }}
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Learn Vocab</h1>
            <div className="grid grid-cols-1 gap-4 mb-2 w-full">
              <button>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className=" p-2 m-8 rounded-lg"
                >
                  <option value="de">German</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr-FR">French (French)</option>
                  <option value="fr-CA">French (Canadian)</option>
                  <option value="it">Italian</option>
                  {/* Add more language options as needed */}
                </select>
              </button>
            </div>

            <div className="grid grid-cols-2 w-full h-full rounded-lg shadow-md bg-black">
              <div className="col-span-1 pr-2 mr-2 rounded-lg bg-white">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your word/phrase"
                  className=" rounded-md w-full p-8 h-64 text-center resize-none"
                />
              </div>

              <div>
                {translatedText && (
                  <div className="col-span-1 pl-2 ml-2 rounded-lg bg-white">
                    <div className="rounded-md p-8 h-72">
                      <ul className="m-0 p-0 list-none text-center">
                        {translations.map((translation, index) => (
                          <li key={index}>{translation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" grid grid-row p-12 m-12">
              <button
                onClick={handleTranslate}
                className="p-2 m-2 bg-black text-white rounded-lg  shadow-lg hover:bg-white hover:text-black"
              >
                Translate
              </button>
              <button
                onClick={callGemini}
                className="m-2 p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-white hover:text-black"
              >
                Ask Google Gemini
              </button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
