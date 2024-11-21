// pages/api/generateQuiz.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const usedQuestions = new Set(); // Keep track of used questions

export default async function handler(req, res) {
  try {
    // Ensure API Key is provided
    const geminiKey = process.env.GEMINI_API_KEY_SEAN;
    if (!geminiKey) {
      throw new Error('Gemini API key is missing. Please check your .env.local file.');
    }

    // Initialize GoogleGenerativeAI with the API Key
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Get quiz type from the request body
    const { quizType } = req.body;
    if (!quizType || (quizType !== 'word-translation' && quizType !== 'phrase-translation')) {
      throw new Error('Invalid quiz type. Please specify either "word-translation" or "phrase-translation".');
    }

    let quizData = null;

    while (!quizData) {
      // Prepare the prompt based on quiz type
      const prompt = quizType === 'word-translation'
        ? `The user is a second language student learning basic Spanish vocabulary.
            Generate a multiple-choice vocabulary quiz.
            1. Provide a unique word in English that hasn't been generated before.
            2. Create a question: "What is the correct translation of this word into Spanish?"
            3. Provide 4 options in Spanish, where only one is correct.
            Format the response as JSON:
            {
              "question": "What is the correct translation of 'apple' into Spanish?",
              "options": ["manzana", "pera", "naranja", "uva"],
              "correctAnswer": "manzana"
            }`
        : `The user is a second language student learning basic Spanish phrases.
            Generate a multiple-choice phrase translation quiz.
            1. Provide a simple phrase in English that is suitable for a beginner or intermediate language learner.
            2. Create a question: "What is the correct translation of this phrase into Spanish?"
            3. Provide 4 options in Spanish, where only one is correct.
            Format the response as JSON:
            {
              "question": "What is the correct translation of 'How are you?' into Spanish?",
              "options": ["¿Cómo estás?", "¿Qué tal?", "¿Dónde estás?", "¿Qué haces?"],
              "correctAnswer": "¿Cómo estás?"
            }`;

      // Generate content from the Gemini API
      const result = await model.generateContent(prompt);

      // Log the result to inspect its structure
      console.log('Gemini API result:', JSON.stringify(result, null, 2));

      // Extract the raw text response from the first candidate
      let rawText = result.response.candidates[0]?.content?.parts[0]?.text;

      // Add a check to ensure rawText is not undefined or empty
      if (!rawText) {
        console.warn('Received an empty response from the Gemini API. Retrying...');
        continue;
      }

      // Remove backticks if present
      rawText = rawText.replace(/```[a-zA-Z]*\n?|\n?```/g, '').trim();

      try {
        quizData = JSON.parse(rawText);
      } catch (err) {
        console.warn(`Failed to parse API response: ${rawText}. Retrying...`);
        quizData = null;
        continue;
      }

      // Verify that quizData has the expected properties
      if (!quizData.question || !quizData.options || !Array.isArray(quizData.options) || !quizData.correctAnswer) {
        console.warn(`Parsed data is missing required fields: ${JSON.stringify(quizData)}. Retrying...`);
        quizData = null;
        continue;
      }

      // Ensure the generated question has not been used before
      if (usedQuestions.has(quizData.question)) {
        console.warn('Duplicate question generated. Retrying...');
        quizData = null;
        continue;
      }
    }

    // Add the question to the set of used questions
    usedQuestions.add(quizData.question);

    // Return the parsed quiz data
    res.status(200).json(quizData);
  } catch (error) {
    console.error('Error in generateQuiz API:', error.message || error, {
      requestBody: req.body,
    });
    res.status(500).json({
      error: error.message || 'Failed to generate quiz. Please try again.'
    });
  }
}
