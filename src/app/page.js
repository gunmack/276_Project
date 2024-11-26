'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const greetings = ['Hello', 'Hola', 'Bonjour', 'Hallo'];

export default function Home() {
  const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);

  // Greeting cycle logic
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGreeting((prevGreeting) => {
        const currentIndex = greetings.indexOf(prevGreeting);
        const nextIndex = (currentIndex + 1) % greetings.length;
        return greetings[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        data-testid="landing page"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 p-6 bg-white border-4 border-gray-300 rounded-xl shadow-lg z-10">
          <p
            className="text-6xl text-center"
            style={{ fontFamily: 'Baloo, sans-serif' }}
          >
            {currentGreeting}!
          </p>
        </div>

        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)] relative">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-5xl text-center mb-8">
                Welcome to QuizLing!
              </h1>
              <p className="text-sm text-center mb-2">
                Learn new languages or enhance your proficiency in those you
                already know.
              </p>
              <p className="text-sm text-center mb-8">
                Explore our features designed to help you learn, practice, and
                grow your skills!
              </p>
              <div className="flex justify-center items-center gap-4 w-full">
                <Link href="main-menu">
                  <button className="bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black">
                    Start Learning
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
