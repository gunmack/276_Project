import handler from '../../pages/api/vocabTranslate'; // Adjust import based on your actual file structure

// Mock the fetch function
global.fetch = jest.fn();

describe('Translation API Handler', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { inputText: 'Hello', targetLanguage: 'es' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it('should return 400 if inputText or targetLanguage is missing', async () => {
    req.body.inputText = '';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'inputText and targetLanguage are required.'
    });
  });

  it('should call the translation API and return translations', async () => {
    // Mock the fetch response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        data: {
          translations: [
            { translatedText: 'Hola', detectedSourceLanguage: 'en' }
          ]
        }
      })
    });

    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://translation.googleapis.com/language/translate/v2'
      ),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: 'Hello', target: 'es' })
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      translations: ['Hola'],
      detectedSourceLanguage: 'en'
    });
  });

  it('should return 500 if the translation API response is unexpected', async () => {
    // Mock an unexpected response from the API
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({})
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unexpected response from translation API'
    });
  });

  it('should return 500 if the translation API throws an error', async () => {
    // Mock an error thrown by the API
    fetch.mockRejectedValueOnce(new Error('API error'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'API error'
    });
  });
});
