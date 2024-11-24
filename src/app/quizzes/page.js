// pages/quizzes/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '../Toolbar';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
export default function Quizzes() {
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizType, setQuizType] = useState('word-translation'); // Default quiz type
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language (Spanish)

  // Explicitly log the current quizType and targetLanguage value to debug any issues
  useEffect(() => {
    console.log('Quiz Type set to:', quizType);
    console.log('Target Language set to:', targetLanguage);
  }, [quizType, targetLanguage]);

  async function fetchQuiz() {
    if (!quizType || !targetLanguage) {
      setFeedback(
        'Please select a quiz type and a language before generating a quiz.'
      );
      return;
    }

    setLoading(true);
    setQuiz(null);
    setFeedback('');
    setUserAnswer(''); // Reset the user's input answer

    try {
      // Adding log to track if fetchQuiz is called and with correct quizType and targetLanguage
      console.log('Calling fetchQuiz function', { quizType, targetLanguage });

      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizType, targetLanguage })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.question || !data.options) {
        throw new Error('Invalid response from server. Please try again.');
      }

      setQuiz(data); // Store the quiz data
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setFeedback('Error generating quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function checkAnswer() {
    if (!quiz || !userAnswer) return;
    const correctAnswer = quiz.correctAnswer;
    const correctOption = ['A', 'B', 'C', 'D'][
      quiz.options.indexOf(correctAnswer)
    ];
    if (userAnswer.toUpperCase() === correctOption) {
      setFeedback('🎉 Correct!');
    } else {
      setFeedback(
        `❌ Incorrect. The correct answer was ${correctOption}: ${correctAnswer}`
      );
    }
  }

  const { user } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/auth'); // Redirect to login page if not logged in
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }
  return (
    <div
      data-testid="Quizzes"
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
    >
      <Toolbar />
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-center max-w-lg w-full">
        <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)] max-w-lg w-full">
          <h1 className="text-5xl text-center mb-4 text-white drop-shadow-md">
            Language Quizzes
          </h1>
          <p className="text-lg text-center text-white mb-6">
            Test your language skills! Generate a random quiz that will ask you
            to translate a word or phrase. Choose the correct option and see how
            well you do!
          </p>
          <div className="mb-4">
            <label className="text-white mr-4">Select Quiz Type:</label>
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="p-2 rounded-md"
            >
              <option value="word-translation">Word Translation</option>
              <option value="phrase-translation">Phrase Translation</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-white mr-4">Select Language:</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="p-2 rounded-md"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <button
            onClick={fetchQuiz}
            disabled={loading}
            className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-md shadow-md hover:bg-gray-800 hover:scale-105 transition-transform duration-200"
          >
            {loading ? 'Loading...' : 'Generate Quiz'}
          </button>
        </div>

        {quiz && (
          <div className="bg-white text-black rounded-lg p-6 shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-4">{quiz.question}</h2>
            <ul className="list-none mb-6">
              {quiz.options.map((option, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">
                    {['A', 'B', 'C', 'D'][index]}:
                  </span>{' '}
                  {option}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-center">
              <input
                type="text"
                placeholder="Enter A, B, C, or D"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full max-w-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={checkAnswer}
                className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
            {feedback && (
              <p
                className={`mt-6 text-lg font-semibold ${
                  feedback.includes('Correct')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
