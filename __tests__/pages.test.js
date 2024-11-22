import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';

import Home from '../src/app/page';
import MainMenu from '../src/app/main-menu/page';
import Achievements from '../src/app/achievements/page';
import AiConversations from '../src/app/ai-conversations/page';
import Flashcards from '../src/app/flashcards/page';
import LearnVocab from '../src/app/learn-vocab/page';
import Quizzes from '../src/app/quizzes/page';
import TextToSpeech from '../src/app/text-to-speech/page';
import TextToSpeechBox from '../components/TextToSpeechButton';
import VocabBox from '../components/VocabBox';

describe('App', () => {
  it('should render Landing page', () => {
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

  it('should render Vocab box', () => {
    render(<VocabBox />);

    const vocab_box = screen.getByTestId('Vocab Box');
    expect(vocab_box).toBeInTheDocument();
  });
});
