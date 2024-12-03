import handler from '../../pages/api/generateVocab';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');

describe('API Handler Tests', () => {
  let mockGenerateContent;

  beforeEach(() => {
    // Mock the GoogleGenerativeAI instance and its methods
    mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        text: () => '**Generated sentence in chosen language**'
      }
    });

    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: mockGenerateContent
      }))
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return generated text', async () => {
    const req = {}; // Mock request object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    // Assertions
    expect(GoogleGenerativeAI).toHaveBeenCalledWith(
      process.env.GOOGLE_CLOUD_GEMINI_JULKAR
    );
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.any(String));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      generatedText: 'Generated sentence in chosen language'
    });
  });

  test('should handle errors from the API', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Error'));

    const req = {}; // Mock request object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'API Error' });
  });
});
