"use client";

import React, { useState } from 'react';
import Toolbar from '../Toolbar';

export default function Quizzes() {
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchQuiz() {
    setLoading(true);
    setQuiz(null);
    setFeedback('');
    try {
      const response = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
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
    const correctOption = ['A', 'B', 'C', 'D'][quiz.options.indexOf(correctAnswer)];
    if (userAnswer.toUpperCase() === correctOption) {
      setFeedback('🎉 Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct answer was ${correctOption}: ${correctAnswer}`);
    }
  }

  return (
    <div
      data-testid="Quizzes"
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
      style={{
        background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)',
      }}
    >
      <Toolbar />
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-start">
        <div className="flex flex-col justify-center items-center p-8 gap-4 font-[family-name:var(--font-geist-mono)]">
          <h1 className="text-5xl text-center mb-4 text-white drop-shadow-md">
            Language Quizzes
          </h1>
          <p className="text-lg text-center text-white mb-6 max-w-md">
            Test your language skills! Generate a random quiz that will ask you to translate a word or phrase. Choose the correct option and see how well you do!
          </p>
          <button
            onClick={fetchQuiz}
            disabled={loading}
            className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-md shadow-md hover:bg-gray-800 hover:scale-105 transition-transform duration-200"
          >
            {loading ? 'Loading...' : 'Generate Random Quiz'}
          </button>
        </div>

        {quiz && (
          <div className="bg-white text-black rounded-lg p-6 shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{quiz.question}</h2>
            <ul className="list-none mb-6">
              {quiz.options.map((option, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{['A', 'B', 'C', 'D'][index]}:</span> {option}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Enter A, B, C, or D"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
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
