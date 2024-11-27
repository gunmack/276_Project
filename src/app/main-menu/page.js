'use client';

import React from 'react';
import Link from 'next/link';
import Toolbar from '../Toolbar';

export default function MainMenu() {
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
      description: 'Learn pronunciation.',
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
    <div
      data-testid="main menu"
      className="relative min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
    >
      <Toolbar />

      {/* Feature select */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-black mb-10 sm:mb-12 px-4 py-2 bg-white rounded-lg shadow-md">
          Begin Your Learning Journey!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-3xl">
          {features.map((feature) => (
            <Link key={feature.name} href={feature.href}>
              <div className="p-6 h-44 w-full rounded-lg shadow-lg bg-white hover:bg-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {feature.name}
                </h2>
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
