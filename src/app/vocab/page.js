'use client';
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function CloudTranslate() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default target language
  const [targetType, setTargetType] = useState('en');
  const [translations, setTranslations] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(''); // State for generated content
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);

  const apiKey = 'AIzaSyCfqxmnxa1547cqCdAub8vEIg4ppkOXmds';
  const geminiKey = 'AIzaSyAhEgcnLuvaBFCipAq-JFAHENYg50Ai13g';

  useEffect(() => {
    // Clear translations on component mount (page reload)
    setTranslations([]);
    setTranslatedText('');
  }, []);

  async function handleTranslate() {
    setError(null); // Reset error state
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: inputText,
          target: targetLanguage
        })
      });

      const data = await response.json();
      const translations = data.data.translations.map((t) => t.translatedText);
      setTranslations(translations);
      setTranslatedText(translations[0]);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  }
  async function callGemini() {
    setError(null); // Reset error state
    // try {
    //   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`;

    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           parts: [
    //             {
    //               text: 'How to say happy birthday in spanish?' // Use the inputText as the prompt
    //             }
    //           ]
    //         }
    //       ]
    //     })
    //   });

    //   const data = await response.json();
    //   if (data.error) {
    //     throw new Error(data.error.message);
    //   }

    //   if (!data.choices || data.choices.length === 0) {
    //     throw new Error('No choices returned from the API');
    //   }

    //   const generatedContent = data.choices[0].text;
    //   setTranslations([generatedContent]);
    // } catch (error) {
    //   setError(error.message);
    //   console.error(error);
    // }

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `The user is a second language student.
      1. Then randomly pick a language: 
        - French  
        - German 
        - Spanish 
        - Italian
      2. Repeat step 1 two times.
      3. Pick a random word from the language. 
      4. Now generate a random sentence with that word.
      Do not include the language in the response. Do not include the category in the response.
      Only respond with your result. Ensure the response in 1 language only.`;

      setTranslatedText('');
      const result = await model.generateContent(prompt);
      let generatedText = result.response.text();
      generatedText = generatedText.replace(/\*\*/g, '');
      setInputText(generatedText); // Update input text with generated content
      setGeneratedContent(generatedText); // Update state with generated content
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  }

  return (
    <div
      className="text-black relative min-h-screen flex flex-col justify-center items-center p-8 sm:p-20 bg-gradient-to-r"
      style={{
        background: 'linear-gradient(to right, #3D6FB6, #4E9D99, #7FBFBA)'
      }}
    >
      <div>
        <h1 className="text-2xl text-center font-bold mb-8">Learn vocab</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 w-full">
        <button>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className=" p-2 m-8 rounded-lg"
          >
            <option value="de">German</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr-FR">French (French)</option>
            <option value="fr-CA">French (Canadian)</option>
            <option value="it">Italian</option>
            {/* Add more language options as needed */}
          </select>
        </button>
      </div>

      <div className="grid grid-cols-2 w-1/2 h-full rounded-lg shadow-md bg-black">
        <div className="col-span-1 pr-2 mr-2 rounded-lg bg-white">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your word/phrase"
            className=" rounded-md w-full p-8 h-64 text-center resize-none"
          />
        </div>

        <div>
          {translatedText && (
            <div className="col-span-1 pl-2 ml-2 rounded-lg bg-white">
              <div className="rounded-md p-8 h-72">
                <ul className="m-0 p-0 list-none text-center">
                  {translations.map((translation, index) => (
                    <li key={index}>{translation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" grid grid-row p-12 m-12">
        <button
          onClick={handleTranslate}
          className="p-2 m-2 bg-black text-white rounded-lg  shadow-lg hover:bg-white hover:text-black"
        >
          Translate
        </button>
        <button
          onClick={callGemini}
          className="m-2 p-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-white hover:text-black"
        >
          Generate a random word/phrase
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* {generatedContent && (
        <div className="text-black p-4 m-4 bg-white rounded-md shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">From Gemini:</h2>
          <p>{generatedContent}</p>
        </div>
      )} */}
    </div>
  );
}
