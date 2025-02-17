'use client';

import React, { useState } from 'react';
import Toolbar from '../../components/Toolbar';
import VocabBox from '../../components/VocabBox';

export default function LearnVocab() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        data-testid="Learn Vocab"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Welcome to Translate!</h2>
              <p className="text-gray-700 mb-6">
                Use this tool to assist with your learning. Enter the text you
                want to translate and select a language to proceed. Also try
                asking Google Gemini to generate a sentence for you.
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

        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className=" font-[family-name:var(--font-geist-mono)]">
            <VocabBox />
          </div>
        </main>
      </div>
    </>
  );
}
