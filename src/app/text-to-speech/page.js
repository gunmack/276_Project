'use client';

import React, { useState } from 'react';
import Toolbar from '../Toolbar';
import TextToSpeechButton from '../../../components/TextToSpeechButton';

export default function TextToSpeech() {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Welcome to Text-to-Speech!</h2>
            <p className="text-gray-700 mb-6">
              Use this tool to translate English words into other languages and learn their pronounciation 
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

      <div
        data-testid="Text to Speech"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Text to Speech</h1>
            <TextToSpeechButton />
          </div>
        </main>
      </div>
    </>
  );
}
