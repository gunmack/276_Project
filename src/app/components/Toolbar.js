'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { getAuth } from 'firebase/auth';

export default function Toolbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [username, setUsername] = useState(''); // State to store the username
  const [showFeatures, setShowFeatures] = useState(true);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes and retrieve the username
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || 'Anonymous User'); // Set displayName or fallback to 'User'
      } else {
        setUsername('Anonymous User'); // Clear username if not authenticated
      }
    });

    if (window.innerWidth < 768) {
      setShowFeatures(false); // Hide features on smaller screens
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }; // Clean up the listener
  }, [auth]);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/logout'); // Redirect to the login page
    } catch (error) {
      console.error('Error logging out:', error); // Log any errors
      alert('An error occurred while logging out. Please try again.');
    }
  };

  const features = [
    {
      name: 'Translate',
      href: './translate',
      description: 'Use the built in translation Feature.',
      icon: '📚'
    },
    {
      name: 'Quizzes',
      href: './quizzes',
      description: 'Test your knowledge.',
      icon: '📝'
    },
    {
      name: 'Text-to-Speech',
      href: './text-to-speech',
      description: 'Learn pronounciation.',
      icon: '🔊'
    },
    {
      name: 'AI Conversations',
      href: './ai-conversations',
      description: 'Practice conversations.',
      icon: '🤖'
    },
    {
      name: 'Flashcards',
      href: './flashcards',
      description: 'Learn with flashcards.',
      icon: '💡'
    },
    {
      name: 'Achievements',
      href: './achievements',
      description: 'Track your progress.',
      icon: '🏆'
    }
  ];

  return (
    <>
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-900"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Side Menu */}
      <div
        className={`absolute top-0 left-0 h-full bg-white p-4 shadow-lg transition-transform duration-300 ${menuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
        style={{
          width: '20%',
          minWidth: '250px',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000
        }}
      >
        <ul className="flex flex-col gap-2 pt-20">
          <div className="text-center">
            <h2 className="text-xs lg:text-lg p-2 font-bold">
              Hello, {username}!
            </h2>
          </div>
          {showFeatures &&
            features.map((feature) => (
              <Link key={feature.name} href={feature.href}>
                <button className="w-full p-2 m-2 rounded-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#5999AE] dark:hover:bg-[#5999AE] text-xs lg:text-lg shadow-md">
                  {feature.name}
                  <span className="ml-2">{feature.icon}</span>
                </button>
              </Link>
            ))}
        </ul>
        <div className="absolute bottom-4 right-4 flex flex-col sm:flex-row items-end lg:items-center gap-2">
          <Link
            href="/main-menu"
            className=" inline-flex items-center gap-2 text-lg font-medium bg-gray-200 p-2  hover:bg-gray-400 rounded-lg transition-all duration-300"
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
            <span className="text-gray-700 ">Home</span>
          </Link>{' '}
          {/* Sign Out Button */}
          {username != 'Anonymous User' && (
            <button
              onClick={handleSignOut}
              className="inline-flex items-cente text-lg font-medium bg-red-500 text-white p-2 hover:bg-red-600 rounded-lg transition-all duration-300"
            >
              <span>Log Out</span>
            </button>
          )}
          {username == 'Anonymous User' && (
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-lg font-medium bg-green-500 text-white p-2 hover:bg-green-600 rounded-lg transition-all duration-300"
            >
              <span>Log In</span>
            </Link>
          )}
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
