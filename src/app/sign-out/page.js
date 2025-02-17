'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const greetings = ['Goodbye', 'adiós', 'au revoir', 'Verabschiedung'];

export default function Logout() {
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
        data-testid="Logout screen"
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      >
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 p-6 bg-white border-4 border-gray-300 rounded-xl shadow-lg z-10 mb-16">
          {' '}
          {/* Added margin-bottom */}
          <p
            className="text-6xl text-center"
            style={{ fontFamily: 'Baloo, sans-serif' }}
          >
            {currentGreeting}!
          </p>
        </div>

        <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
          <div className="flex flex-col justify-center items-center p-8 gap-8 font-[family-name:var(--font-geist-mono)] relative text-center">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-3xl mb-16">Sign out successful!</h1>
              <p className="mb-8">Thank you for using QuizLing.</p>
              {/* <p className="mb-8"> Please consider filling out our survey:</p>

              <a
                href="https://forms.office.com/r/gYpzRm1u5R"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black mb-8"
              >
                QuizLing Survey
              </a> */}

              <div className="flex justify-center items-center gap-4 w-full">
                <Link href="\">
                  <button className="bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black">
                    Return to landing page
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
