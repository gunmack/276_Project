import { GoogleGenerativeAI } from '@google/generative-ai';

const usedQuestions = new Set(); // Keep track of used questions
let lastGeneratedQuiz = null; // Store the most recent quiz

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (lastGeneratedQuiz) {
        return res.status(200).json(lastGeneratedQuiz);
      } else {
        return res
          .status(404)
          .json({ error: 'No quiz available. Please generate a quiz first.' });
      }
    }

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method Not Allowed. Please use POST.'
      });
    }

    // Ensure API Key is provided
    const geminiKey = process.env.GEMINI_API_KEY_SEAN;
    if (!geminiKey) {
      throw new Error(
        'Gemini API key is missing. Please check your .env.local file.'
      );
    }

    // Initialize GoogleGenerativeAI with the API Key
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Get quiz type and target language from the request body
    const { quizType, targetLanguage } = req.body;
    if (
      !quizType ||
      (quizType !== 'word-translation' && quizType !== 'phrase-translation')
    ) {
      throw new Error(
        'Invalid quiz type. Please specify either "word-translation" or "phrase-translation".'
      );
    }

    if (!targetLanguage) {
      throw new Error('Target language is missing. Please select a language.');
    }

    // Map language codes to full language names
    const languageMap = {
      es: 'Spanish',
      fr: 'French',
      de: 'German'
    };
    const targetLanguageFull = languageMap[targetLanguage] || targetLanguage;

    let quizData = null;
    let retryCount = 0;
    const maxRetries = 10;

    while (!quizData && retryCount < maxRetries) {
      // Prepare the prompt based on quiz type and target language
      const prompt = getPrompt(
        quizType,
        targetLanguageFull,
        Array.from(usedQuestions)
      );

      try {
        // Generate content from the Gemini API
        const result = await model.generateContent(prompt);

        // Extract the raw text response from the first candidate
        let rawText = result.response.candidates[0]?.content?.parts[0]?.text;

        if (!rawText) {
          console.warn(
            'Received an empty response from the Gemini API. Retrying...'
          );
          retryCount++;
          continue;
        }

        // Remove backticks if present
        rawText = rawText.replace(/```[a-zA-Z]*\n?|\n?```/g, '').trim();

        try {
          quizData = JSON.parse(rawText);
        } catch (err) {
          console.warn(`Failed to parse API response: ${rawText}. Retrying...`);
          retryCount++;
          continue;
        }

        if (!isValidQuizData(quizData)) {
          console.warn(
            `Parsed data is missing required fields: ${JSON.stringify(quizData)}. Retrying...`
          );
          quizData = null;
          retryCount++;
          continue;
        }

        if (usedQuestions.has(quizData.question)) {
          console.warn('Duplicate question generated. Retrying...');
          quizData = null;
          retryCount++;
          continue;
        }

        // Randomize the position of the correct answer
        quizData.options = shuffleOptions(
          quizData.options,
          quizData.correctAnswer
        );
      } catch (apiError) {
        if (apiError.message.includes('503')) {
          console.warn('API is overloaded. Retrying...');
        } else {
          throw apiError;
        }
        retryCount++;
      }
    }

    if (!quizData) {
      throw new Error(
        'Unable to generate a unique quiz after multiple attempts. Please try again.'
      );
    }

    usedQuestions.add(quizData.question);
    lastGeneratedQuiz = quizData; // Store the most recent quiz
    res.status(200).json(quizData);
  } catch (error) {
    console.error('Error in generateQuiz API:', error.message || error, {
      requestBody: req.body
    });
    res.status(500).json({
      error: error.message || 'Failed to generate quiz. Please try again.'
    });
  }
}

function getPrompt(quizType, targetLanguage, usedWords) {
  const usedWordsText = usedWords.length
    ? `Words already used: ${usedWords.join(', ')}.`
    : '';

  if (quizType === 'word-translation') {
    return `
    You are an assistant helping students learn ${targetLanguage} vocabulary.
    Generate a unique multiple-choice vocabulary quiz.
    Instructions:
    1. Choose a **common and simple** word in **English** that is often used in daily conversations, suitable for beginners.
    2. Ensure that the chosen word **has not been used before**. ${usedWordsText}
    3. Create a question: "What is the correct translation of this word into ${targetLanguage}?"
    4. Provide **4 distinct options** in **${targetLanguage}**, with **one correct answer** and three incorrect options. The incorrect options should be plausible but incorrect.
    5. Ensure that the word and options are suitable for a beginner learning ${targetLanguage} vocabulary.
    6. Randomly place the correct answer among the four options, so that it is not always in the first position.
    Format the response as a valid JSON object:
    {
      "question": "What is the correct translation of 'apple' into ${targetLanguage}?",
      "options": ["manzana", "pera", "naranja", "uva"],
      "correctAnswer": "manzana"
    }`;
  } else {
    return `
    You are an assistant helping students learn ${targetLanguage} phrases.
    Generate a unique multiple-choice phrase translation quiz.
    Instructions:
    1. Choose a **common and useful phrase** in **English** that is suitable for beginner or intermediate language learners, such as greetings, common questions, or everyday expressions.
    2. Ensure that the chosen phrase **has not been used before**. ${usedWordsText}
    3. Create a question: "What is the correct translation of this phrase into ${targetLanguage}?"
    4. Provide **4 distinct options** in **${targetLanguage}**, with **one correct answer** and three incorrect options. The incorrect options should be plausible but incorrect.
    5. Ensure that the phrase and options are relevant to daily communication and are suitable for beginners.
    6. Randomly place the correct answer among the four options, so that it is not always in the first position.
    Format the response as a valid JSON object:
    {
      "question": "What is the correct translation of 'How are you?' into ${targetLanguage}?",
      "options": ["¿Cómo estás?", "¿Qué tal?", "¿Dónde estás?", "¿Qué haces?"],
      "correctAnswer": "¿Cómo estás?"
    }`;
  }
}

function isValidQuizData(quizData) {
  return (
    quizData &&
    quizData.question &&
    Array.isArray(quizData.options) &&
    quizData.correctAnswer
  );
}

function shuffleOptions(options, correctAnswer) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Ensure the correct answer is still in the options
  if (!shuffled.includes(correctAnswer)) {
    shuffled[Math.floor(Math.random() * shuffled.length)] = correctAnswer;
  }
  return shuffled;
}
