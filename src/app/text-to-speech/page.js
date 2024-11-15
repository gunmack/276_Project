import React from 'react';
import Toolbar from '../Toolbar';
import Link from 'next/link';


export default function TextToSpeech() {
  return (
    <>
      <div
        data-testid="Text to Speech"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
        style={{
          background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
        }}
        
      >
        <Toolbar/>
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Text to Speech</h1>
          </div>
        </main>
      </div>
    </>
  );
}