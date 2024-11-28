import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

import Home from '../src/app/page';
import MainMenu from '../src/app/main-menu/page';
import Achievements from '../src/app/achievements/page';
import AiConversations from '../src/app/ai-conversations/page';
import Flashcards from '../src/app/flashcards/page';
import LearnVocab from '../src/app/translate/page';
import Quizzes from '../src/app/quizzes/page';
import TextToSpeech from '../src/app/text-to-speech/page';
import TextToSpeechBox from '../src/components/TextToSpeechButton';
import Logout from '../src/app/sign-out/page';
import Login from '../src/app/auth/page';
import { useAuth } from '../src/app/context/AuthContext';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// jest.setup.js
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    name: '[DEFAULT]'
  }))
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Call the callback to simulate a user signing in
    callback({ displayName: 'Mock User' });

    // Return an unsubscribe mock function
    return jest.fn();
  })
}));
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn()
}));

jest.mock('../src/app/context/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({}) // Mocking as if a user is logged in
}));

describe('App', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
      query: {},
      pathname: '/'
    }));
  });

  beforeEach(() => {
    // Set up mock behavior for the useAuth hook and useRouter
    useAuth.mockReturnValue({}); // Mock as if user is authenticated (returning a user object)
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
      query: {},
      pathname: '/'
    }));
  });

  beforeEach(() => {
    mockOnAuthStateChanged.mockClear(); // Clear the mock between tests
  });

  it('should render Landing page', () => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
      query: {},
      pathname: '/'
    }));
    render(<Home />);

    const home = screen.getByTestId('landing page');
    expect(home).toBeInTheDocument();
  });

  it('should render Main Menu', () => {
    render(<MainMenu />);

    const main_menu = screen.getByTestId('main menu');
    expect(main_menu).toBeInTheDocument();
  });

  it('should render Achievements page', () => {
    render(<Achievements />);

    const achievements = screen.getByTestId('Achievements');
    expect(achievements).toBeInTheDocument();
  });

  it('should render Ai Conversations page', () => {
    render(<AiConversations />);

    const ai_convo = screen.getByTestId('AI conversations');
    expect(ai_convo).toBeInTheDocument();
  });

  it('should render Flashcards page', () => {
    render(<Flashcards />);

    const flashcards = screen.getByTestId('Flashcards');
    expect(flashcards).toBeInTheDocument();
  });
  it('should render Learn Vocab page', () => {
    render(<LearnVocab />);

    const vocab = screen.getByTestId('Learn Vocab');
    expect(vocab).toBeInTheDocument();
  });

  it('should render Quizzes page', () => {
    render(<Quizzes />);

    const quizzes = screen.getByTestId('Quizzes');
    expect(quizzes).toBeInTheDocument();
  });

  it('should render Text to Speech page', () => {
    render(<TextToSpeech />);

    const tts = screen.getByTestId('Text to Speech');
    expect(tts).toBeInTheDocument();
  });

  it('should render Text to Speech box', () => {
    render(<TextToSpeechBox />);

    const tts_box = screen.getByTestId('tts-box');
    expect(tts_box).toBeInTheDocument();
  });

  it('should render Login Screen', () => {
    render(<Login />);

    const login = screen.getByTestId('Login screen');
    expect(login).toBeInTheDocument();
  });
  it('should render Logout screen', () => {
    render(<Logout />);

    const logout = screen.getByTestId('Logout screen');
    expect(logout).toBeInTheDocument();
  });
});
