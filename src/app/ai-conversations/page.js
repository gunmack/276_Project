'use client'; // Client-side rendering

import Toolbar from '../Toolbar';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function GeminiChatbot() {
  // initialize state variables
  const [language, setLanguage] = useState('English'); 
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  
  // retrieves a conversation string from localStorage if it has data then 
  // parse the JSON string into an array
  useEffect(() => {
    const savedConversation = localStorage.getItem('conversation');
    if (savedConversation) {
      setConversation(JSON.parse(savedConversation));
    }
  }, []);


  //save conversation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('conversation', JSON.stringify(conversation));
  }, [conversation]);

  // function to update the language state based on the dropdown selection
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  // function for handling the message sending process 
  const handleSendMessage = async () => {
    // stops function from executing if the message input is empty
    if (!message) return;
  
    // set loading state to true while waiting from response
    setIsLoading(true);
    

    try {
      // retrieving gemini key stuff
      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
      //limit the chatbot to remember 10 questions in the past
      const limitedHistory = conversation.slice(-10);
      // maps over the last 10 msgs, it converts each message object to a string 
      const conversationHistory = limitedHistory
      // in the format Sender: Text
        .map((msg) => `${msg.sender}: ${msg.text}`)
        // join the strings together with newlines 
        .join('\n');
  
      // builds a detailed prompt for the AI, including the last 10 messages
      const prompt = `
        This is a conversation history:
        ${conversationHistory}
  
        User said: "${message}". 
        Respond as a helpful chatbot in ${language}. Do not provide multiple options, just give a single, direct response.
      `;
      
      // sends the prompt to ai 
      const result = await model.generateContent(prompt);
      // takes the text form the AI response object
      const reply = result.response.text();
  
      // updates the conversation history by appending the user's message and the bot's reply
      setConversation((prev) => [
        ...prev,
        { sender: 'User', text: message },
        { sender: 'Bot', text: reply },
      ]);
      // clears the input field after sending the message
      setMessage('');
      // catches any errors during the API call and updates the error state with the error message
    } catch (err) {
      setError(`Error: ${err.message}`);
      //resets the isLoading stte to false ensuring the chatbot can accept new messages
    } finally {
      setIsLoading(false);
    }
  };


  const handleClearChat = () => {
    setConversation([]); // Clear conversation
    localStorage.removeItem('conversation'); // Remove from localStorage
  };


  return (<div className="chatbot-container">

    <Toolbar />
    <h1>Gemini Multilingual Chatbot</h1>
    
    {/* Language Selector */}
    <label htmlFor="language-select">Choose a Language: </label>
    <select
      id="language-select"
      value={language}
      onChange={handleLanguageChange}
      className="language-dropdown"
    >
      <option value="French">French</option>
      <option value="German">German</option>
      <option value="Spanish">Spanish</option>
      <option value="English">English</option>
    </select>
  
    {/* Chat Display */}
    <div className="chat-area">
      {conversation.map((msg, idx) => (
        // for each message it renders a <p> element
        <p
          key={idx}
          className={`message ${msg.sender === 'User' ? 'user' : 'bot'}`}
        >
          <strong>{msg.sender}: </strong>
          {msg.text}
        </p>
      ))}
    </div>
      
    {/* Input Area */}
    
    <div className="input-container">
      
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    }}
    placeholder="Type your message..."
    className="text-input"
  />
  
  <button
    onClick={handleSendMessage}
    className="speak-button"
    disabled={!message || isLoading}
  >
    {isLoading ? 'Generating...' : 'Send'}
  </button>
</div>

    
    <button onClick={handleClearChat} className="top-right-clear">
      Clear Chat
    </button>
  
    {/* Error Display */}
    {error && <p className="error">{error}</p>}
  </div>
  
  );
}
