'use client';

import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar';
import TextToSpeechButton from '../../components/TextToSpeechButton';

export default function TextToSpeech() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Text-to-Speech!
            </h2>
            <p className="text-gray-700 mb-6">
              Use this tool to translate English words into other languages and
              learn their pronunciation. Just select the language you want to
              hear and type what you want translated then press "Speak
              Translated Text."
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
      <button
        onClick={() => setShowPopup(true)}
        className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:text-black fixed top-4 right-4 flex items-center justify-center w-16 h-16"
      >
        ❔
      </button>

      <div
        data-testid="Text to Speech"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <TextToSpeechButton />
          </div>
        </main>
      </div>
    </>
  );
}
