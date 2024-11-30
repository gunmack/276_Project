import handler from '../../pages/api/flashcardsTranslate'; // Adjust the path to the actual location of your handler

// Mocking the global fetch method
global.fetch = jest.fn();

describe('Translation API Handler', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        inputText: 'Hello',
        targetLanguage: 'es' // Spanish, for example
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock the environment variable for the API key
    process.env.GOOGLE_CLOUD_TRANSLATE_JULKAR = 'fake-api-key'; // Use a mock API key
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return translated text on success', async () => {
    const mockTranslationResponse = {
      data: {
        translations: [
          { translatedText: 'Hola' } // Expected translation
        ]
      }
    };

    // Mocking fetch to return a successful response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTranslationResponse)
    });

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://translation.googleapis.com/language/translate/v2?key='
      ),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Hello') // Ensure that inputText is in the request body
      })
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      translations: ['Hola']
    });
  });

  it('should return error response if API request fails', async () => {
    const mockError = new Error('API request failed');

    // Mocking fetch to simulate an error
    fetch.mockRejectedValueOnce(mockError);

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'API request failed'
    });
  });

  it('should return error if API key is missing from environment variables', async () => {
    // Simulate missing API key in environment variables
    process.env.GOOGLE_CLOUD_TRANSLATE_JULKAR = undefined;

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Cannot read properties of undefined (reading 'json')"
    });
  });

  it('should handle missing inputText', async () => {
    mockRequest.body.inputText = ''; // Simulate missing inputText

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'inputText is required'
    });
  });

  it('should handle missing targetLanguage', async () => {
    mockRequest.body.targetLanguage = ''; // Simulate missing targetLanguage

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'targetLanguage is required'
    });
  });

  it('should handle unexpected response format from the API', async () => {
    // Mocking fetch to return an unexpected response structure
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ data: {} }) // No translations key
    });

    // Call the handler
    await handler(mockRequest, mockResponse);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unexpected response format from translation API'
    });
  });
});
