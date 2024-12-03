'use client';
import React from 'react';
import translate from './translate';

export default function VocabBox() {
  var {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    sourceLang,
    setSourceLang,
    targetLanguage,
    setTargetLanguage,
    translations,
    Tloading,
    Gloading,
    clearText,
    clear,
    textareaRef,
    languageOptions,
    swapFields,
    handleTranslate,
    callGemini,
    getLanguageName
  } = translate();

  return (
    <>
      <div data-testid="Vocab Box" className="vocab-box">
        <div className="vocab-text">
          <div className="flex flex-1 gap-4">
            <div>
              <select
                disabled={true}
                id="languageSelect"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="language-dropdown pb-4"
              >
                <option value="" disabled>
                  {sourceLang
                    ? getLanguageName(sourceLang)
                    : 'Detected language'}
                </option>
              </select>
              <br />
              <br />

              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setTargetLanguage('');
                }}
                className="textarea"
                placeholder={
                  Gloading ? 'Asking Gemini... ' : 'Enter text or ask Gemini...'
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Check if Enter key is pressed
                    e.preventDefault(); // Prevent default Enter key behavior (like newline in textarea)
                    handleTranslate(); // Call the translate function
                  }
                }}
                rows={10}
                cols={50}
              />
            </div>

            {inputText && (
              <button
                className="text-clear"
                onClick={clearText}
                aria-label="Clear text"
              >
                &times; {/* HTML entity for the "X" character */}
              </button>
            )}

            <button
              onClick={swapFields}
              aria-label="Swap fields"
              disabled={!outputText}
              className={`bg-emerald-300 h-1/3 mt-44 rounded-md p-1 
  ${outputText ? 'hover:bg-emerald-500' : 'opacity-50 cursor-not-allowed'}`}
            >
              <img
                src="data:image/png;base64,
                iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7klEQVR4
                nO2ZwQqDMBBE5/MqveRg8NB+fdK/sJAi5BAkVXOozazzYC+LBwfiZGcFhBBsDABiLgdiIoCUawYwwYCQxCzG5Zc3IWas
                iHkDeIKQUWIA3AG88ge32ODRfjq55j1rLh0jNPbPrmhFSDhyqy4P3Rr63R2t3vBfnOsBIrxEdIKzMqJECyJMjfFDYfVUFi
                uEEL/BFfumMlxRMa3Ghs1QwyIi7YUaFhEz243rlQc6wVsNNemk1U7LHm33CuhlvRMb+3aFuD8drdY9Wlj1q2gL3iujpf8T
                k4URZUsM5fRbE0M3/daCVWAOVkJclQ+6NrIaq+fhgAAAAABJRU5ErkJggg=="
                alt="sorting-arrows-horizontal"
              ></img>
            </button>

            <div>
              <select
                disabled={!inputText}
                id="languageSelect"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={`language-dropdown pb-4 ${
                  inputText ? '' : 'opacity-50 cursor-not-allowed' // Dim the dropdown if disabled
                }`}
              >
                <option value="" disabled>
                  Translate to
                </option>
                {languageOptions.map((lang) => (
                  <option key={lang.key} value={lang.key}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <br />
              <br />
              <textarea
                disabled={true}
                ref={textareaRef}
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                className="textarea"
                placeholder={
                  Tloading
                    ? 'Translating...'
                    : 'Translation will appear here...'
                }
                rows={10}
                cols={50}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="translate-button-container">
          <button
            onClick={callGemini}
            className="translate-button"
            disabled={Gloading}
          >
            {Gloading ? 'Asking Gemini...' : 'Ask Google Gemini'}
          </button>

          {/* 
          {inputText && (
            <button
              onClick={handleTranslate}
              className="translate-button"
              disabled={Tloading}
            >
              {Tloading ? 'Translating...' : 'Translate'}
            </button>
          )} */}

          {translations && (
            <button onClick={clear} className="clear-button">
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}
