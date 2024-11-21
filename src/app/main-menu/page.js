'use client';

import React from 'react';
import Link from 'next/link';
import Toolbar from '../Toolbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MainMenu() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth'); // Redirect to login page if not logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }
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
    <div
      data-testid="main menu"
      className="relative min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      style={{
        background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
      }}
    >
      <Toolbar />

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
