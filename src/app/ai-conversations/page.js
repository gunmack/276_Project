'use client'; // Client-side rendering
import React from 'react';
import Toolbar from '../Toolbar';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseDB } from '../../../firebase_config';
import { getDatabase, ref, get, set } from 'firebase/database';

export default function GeminiChatbot() {
  const { user } = useAuth();

  const [language, setLanguage] = useState('English');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const addToAImsg = async () => {
    const database = getDatabase(firebaseDB);
    const AImsgCountRef = ref(database, `Users/${user.displayName}/AImsgCount`);
    const count = await get(AImsgCountRef);
    let newCount = 1;
    if (count.exists()) {
      newCount = count.val() + 1;
    }
    try {
      await set(AImsgCountRef, newCount);
    } catch (error) {
      console.error(error);
    }
  };

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
      //use the fetch function to send a request to the API
      const response = await fetch('/api/geminiChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // string the JSON response and extract the three values
        body: JSON.stringify({
          message,
          language,
          conversation
        })
      });

      // store response into data
      const data = await response.json();

      // if no response give error
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response.');
      }

      // updates the conversation history by appending the user's message and the bot's reply
      setConversation((prev) => [
        ...prev,
        { sender: 'User', text: message },
        { sender: 'Bot', text: data.reply }
      ]);
      addToAImsg();
      setMessage('');
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setConversation([]);
    localStorage.removeItem('conversation');
  };

  return (
    <div className="chatbot-container" data-testid="AI conversations">
      <Toolbar />

      <h1>Gemini Multilingual Chatbot</h1>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Gemini Chatbot!
            </h2>
            <p className="text-gray-700 mb-6">
              Use this multilingual chatbot to communicate in various languages.
              Select a language from the dropdown menu and send a message to
              receive responses in your chosen language.
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

      <label htmlFor="language-select">Choose a Language: </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="language-dropdown"
      >
        <option value="English">English</option>
        <option value="French">French</option>
        <option value="German">German</option>
        <option value="Spanish">Spanish</option>
      </select>

      <div className="chat-area">
        {conversation.map((msg, idx) => (
          <p
            key={idx}
            className={`message ${msg.sender === 'User' ? 'user' : 'bot'}`}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
          </p>
        ))}
      </div>

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
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <button onClick={handleClearChat} className="top-right-clear">
        Clear Chat
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
