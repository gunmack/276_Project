import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  try {
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

    // Determine quiz type (word or phrase translation)
    const quizType =
      Math.random() > 0.5 ? 'word-translation' : 'phrase-translation';

    // Prepare the prompt (simplified)
    const prompt =
      quizType === 'word-translation'
        ? `The user is a second language student.
          Generate a multiple-choice vocabulary quiz.
          1. Provide a single word in English.
          2. Create a question: "What is the correct translation of this word into Spanish?"
          3. Provide 4 options in Spanish, where only one is correct, formatted as a single string with each option labeled, for example: "1. manzana 2. pera 3. naranja 4. uva"
          Format the response as JSON:
          {
            "question": "What is the correct translation of 'apple' into Spanish?",
            "options": "1. manzana 2. pera 3. naranja 4. uva",
            "correctAnswer": "1"
          }`
        : `The user is a second language student.
          Generate a multiple-choice phrase translation quiz.
          1. Provide a short phrase in English.
          2. Create a question: "What is the correct translation of this phrase into Spanish?"
          3. Provide 4 options in Spanish, where only one is correct, formatted as a single string with each option labeled, for example: "1. ¿Cómo estás? 2. ¿Qué tal? 3. ¿Dónde estás? 4. ¿Qué haces?"
          Format the response as JSON:
          {
            "question": "What is the correct translation of 'How are you?' into Spanish?",
            "options": "1. ¿Cómo estás? 2. ¿Qué tal? 3. ¿Dónde estás? 4. ¿Qué haces?",
            "correctAnswer": "1"
          }`;

    // Generate content from the Gemini API
    const result = await model.generateContent(prompt);

    // Log the result to inspect its structure
    console.log('Gemini API result:', JSON.stringify(result, null, 2));

    // Ensure the response is valid
    if (!result || !result.response || typeof result.response !== 'object') {
      throw new Error('Invalid response format from Gemini API.');
    }

    // Extract and parse the raw text response
    const rawText = result.response.text;
    let quizData;
    try {
      quizData = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`Failed to parse API response: ${rawText}`);
    }

    // Return the parsed quiz data
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
