'use client';

import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { firebaseDB } from '../../../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';
export default function Quizzes() {
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizType, setQuizType] = useState('word-translation'); // Default quiz type
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language (Spanish)
  const [showPopup, setShowPopup] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addToQuiz = async () => {
    const database = getDatabase(firebaseDB);
    const QuizCounttRef = ref(database, `Users/${user.displayName}/QuizCount`);
    const count = await get(QuizCounttRef);
    let newCount = 1;
    if (count.exists()) {
      newCount = count.val() + 1;
    }
    try {
      await set(QuizCounttRef, newCount);
    } catch (error) {
      console.error(error);
    }
  };

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
    setIsSubmitted(false);

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
    setIsSubmitted(true);
    if (!quiz || !userAnswer) return;
    const correctAnswer = quiz.correctAnswer;
    const correctOption = ['A', 'B', 'C', 'D'][
      quiz.options.indexOf(correctAnswer)
    ];
    if (userAnswer.toUpperCase() === correctOption) {
      addToQuiz();
      setFeedback('🎉 Correct!');
    } else {
      setFeedback(
        `❌ Incorrect. The correct answer was ${correctOption}: ${correctAnswer}`
      );
    }
  }
  const { user } = useAuth();

  return (
    <div
      data-testid="Quizzes"
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-ibmPlexMono)] bg-gradient-to-r"
    >
      <Toolbar />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Language Quizzes!
            </h2>
            <p className="text-gray-700 mb-6">
              Test your knowledge with our quizzes. Select a quiz type and
              language to get started!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-black text-white p-2 rounded-lg shadow-lg hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:text-black"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowPopup(true)}
        className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:text-black fixed top-4 right-4 flex items-center justify-center w-16 h-16"
      >
        ❔
      </button>

      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-center max-w-lg w-full">
        {quiz ? (
          <div className="bg-white text-black rounded-lg p-8 shadow-lg w-[200%] max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">{quiz.question}</h2>
            <ul className="list-none mb-8">
              {quiz.options.map((option, index) => (
                <li key={index} className="mb-4 text-lg">
                  <span className="font-bold text-xl">
                    {['A', 'B', 'C', 'D'][index]}:
                  </span>{' '}
                  {option}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col items-center justify-center gap-8 w-3/4 max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Enter A, B, C, or D"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="border px-6 py-3 text-lg rounded-lg w-full text-black focus:outline-none focus:ring-4 focus:ring-black"
              />
              {!isSubmitted && (
                <button
                  onClick={checkAnswer}
                  className="mt-4 px-8 py-3 bg-black text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#5999AE] transition"
                >
                  Submit
                </button>
              )}
            </div>
            {feedback && (
              <p
                className={`mt-8 text-xl font-semibold ${
                  feedback.includes('Correct')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 text-black rounded-lg p-8 shadow-lg max-w-3xl w-full text-center">
            <h2 className="text-3xl font-bold mb-4">Language Quizzes!</h2>
            <p className="text-lg text-gray-700">
              Select a quiz type and language, then click "Generate Quiz" to get
              started!
            </p>
          </div>
        )}

        <div className="bg-white text-black rounded-lg p-6 shadow-lg w-[80%] flex flex-col items-center gap-4">
          <div className="w-full text-center mb-1">
            <label className="text-black block mb-2 text-lg">
              Select Quiz Type:
            </label>
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="p-2 rounded-md border border-gray-300 bg-black text-white w-3/4 max-w-xs"
            >
              <option value="word-translation">Word Translation</option>
              <option value="phrase-translation">Phrase Translation</option>
            </select>
          </div>
          <div className="w-full text-center mb-4">
            <label className="text-black block mb-2 text-lg">
              Select Language:
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="p-2 rounded-md border border-gray-300 bg-black text-white w-3/4 max-w-xs"
            >
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          <button
            onClick={fetchQuiz}
            disabled={loading}
            className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-md shadow-md hover:bg-[#5999AE] dark:hover:bg-[#5999AE] hover:scale-105 transition-transform duration-200"
          >
            {loading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      </main>
    </div>
  );
}
