import React from 'react';
import Toolbar from '../Toolbar';
import VocabBox from '../../../components/VocabBox';

export default function LearnVocab() {
  return (
    <>
      <div
        data-testid="Learn Vocab"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <Toolbar />
        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
            <h1 className="text-5xl text-center mb-2">Learn Vocab</h1>
            <VocabBox />
          </div>
        </main>
      </div>
    </>
  );
}
