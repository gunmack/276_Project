"use client";

import React, { useState } from "react";

export default function MainMenu() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);

  const toggleMenu = () => {
    if (menuOpen) {
      setButtonVisible(false);
      setMenuOpen(false);
      setTimeout(() => {
        setButtonVisible(true);
      }, 170); 
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r" style={{ background: "linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)" }}>

      
      <div
        className={`absolute top-0 left-0 h-full bg-white p-4 shadow-lg transition-transform duration-300 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
        style={{ width: '25%' }}
      >
        <ul className="flex flex-col gap-6 pt-20">

          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            Learn Vocab
          </button>


          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            Quizzes
          </button>


          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            Text-to-speech
          </button>


          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            AI Conversations
          </button>

          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            Flashcards
          </button>


          <button className="rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-5 shadow-md">
            Achievements
          </button>
        </ul>


        <button
          className={`absolute top-8 right-4 flex flex-col items-center justify-center w-10 h-10 hover:bg-[#d1d1d1] dark:hover:bg-[#d1d1d1] p-2 bg-gray-200 rounded transition-all duration-300`}
          onClick={toggleMenu}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          
        </button>

        <button
          className={`absolute bottom-8 right-4 flex flex-col items-center justify-center w-10 h-10 hover:bg-[#d1d1d1] dark:hover:bg-[#d1d1d1] p-2 bg-gray-200 rounded transition-all duration-300`}
          >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-black">
          <path d="M12 3L2 9v12h7v-7h6v7h7V9l-10-6z"/>
        </svg>

          
        </button>
      </div>


      {!menuOpen && buttonVisible && (
        <button
          className="fixed top-8 left-8 flex flex-col items-center justify-center w-10 h-10 hover:bg-[#d1d1d1] dark:hover:bg-[#d1d1d1] p-2 bg-gray-200 rounded"
          onClick={toggleMenu}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
      )}


      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Main Menu</h1>
      </div>
    </div>
  );
}
