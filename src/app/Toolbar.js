'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Toolbar() {
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

  const features = [
    {
      name: 'Learn Vocab',
      href: './learn-vocab',
      description: 'Expand your vocabulary.'
    },
    {
      name: 'Quizzes',
      href: './quizzes',
      description: 'Test your knowledge.'
    },
    {
      name: 'Text-to-Speech',
      href: './text-to-speech',
      description: 'Learn pronounciation.'
    },
    {
      name: 'AI Conversations',
      href: './ai-conversations',
      description: 'Practice conversations.'
    },
    {
      name: 'Flashcards',
      href: './flashcards',
      description: 'Learn with flashcards.'
    },
    {
      name: 'Achievements',
      href: './achievements',
      description: 'Track your progress.'
    }
  ];

  return (
    <>
      {/* Side Menu */}
      <div
        className={`absolute top-0 left-0 h-full bg-white p-4 shadow-lg transition-transform duration-300 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
        style={{ width: '20%' }}
      >
        <ul className="flex flex-col gap-6 pt-20">
          {features.map((feature) => (
            <Link key={feature.name} href={feature.href}>
              <button className="w-full h-14 rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base shadow-md">
                {feature.name}
              </button>
            </Link>
          ))}
        </ul>

        <div className="absolute bottom-4 right-4">
          <Link
            href="/main-menu"
            className="inline-flex items-center gap-2 text-lg font-medium bg-gray-200 p-2 hover:bg-gray-300 rounded-lg transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-700 transition-all duration-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5L12 4.5l9 6v9.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V10.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 21V11.25h4.5V21"
              />
            </svg>
            <span className="text-gray-700">Home</span>
          </Link>
        </div>

        <button
          className={`absolute top-8 right-4 flex flex-col items-center justify-center w-12 h-12 hover:bg-[#d1d1d1] dark:hover:bg-[#d1d1d1] p-2 bg-gray-200 rounded transition-all duration-300`}
          onClick={toggleMenu}
        >
          <span className="block w-7 h-0.5 bg-black mb-1 rounded-md"></span>
          <span className="block w-7 h-0.5 bg-black mb-1 rounded-md"></span>
          <span className="block w-7 h-0.5 bg-black rounded-md"></span>
        </button>
      </div>

      {/* Toggle Button */}
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
    </>
  );
}
