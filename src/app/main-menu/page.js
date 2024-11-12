'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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

  const features = [
    {
      name: 'Learn Vocab',
      href: '/mainmenu/vocab',
      description: 'Expand your vocabulary.'
    },
    {
      name: 'Quizzes',
      href: '/mainmenu/quizzes',
      description: 'Test your knowledge.'
    },
    {
      name: 'Text-to-Speech',
      href: '/mainmenu/text-to-speech',
      description: 'Hear the words.'
    },
    {
      name: 'AI Conversations',
      href: '/mainmenu/ai-conversations',
      description: 'Practice speaking.'
    },
    {
      name: 'Flashcards',
      href: '/mainmenu/flashcards',
      description: 'Learn with flashcards.'
    },
    {
      name: 'Achievements',
      href: '/mainmenu/achievements',
      description: 'Track your progress.'
    }
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      style={{
        background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
      }}
    >
      {/* Side Menu */}
      <div
        className={`absolute top-0 left-0 h-full bg-white p-4 shadow-lg transition-transform duration-300 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
        style={{ width: '25%' }}
      >
        <ul className="flex flex-col gap-6 pt-10">
          {/* Home Icon */}
          <Link href="/">
            <li className="flex items-center gap-2 text-lg font-medium cursor-pointer p-4 hover:bg-gray-100 rounded-lg transition-all duration-300 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300"
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
              <span className="group-hover:text-blue-500 transition-all duration-300">
                Home
              </span>
            </li>
          </Link>

          {features.map((feature) => (
            <Link key={feature.name} href={feature.href}>
              <button className="w-full h-14 rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-sm sm:text-base shadow-md">
                {feature.name}
              </button>
            </Link>
          ))}
        </ul>

        <button
          className={`absolute top-8 right-4 flex flex-col items-center justify-center w-10 h-10 hover:bg-[#d1d1d1] dark:hover:bg-[#d1d1d1] p-2 bg-gray-200 rounded transition-all duration-300`}
          onClick={toggleMenu}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
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

      {/* Centered Feature Boxes */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-6">Main Menu</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-3xl">
          {features.map((feature) => (
            <Link key={feature.name} href={feature.href}>
              <div className="p-6 h-40 w-full rounded-lg shadow-lg bg-white hover:bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold">{feature.name}</h2>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
