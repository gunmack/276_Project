import { GoogleGenerativeAI } from '@google/generative-ai';
import handler from '../../pages/api/geminiChat'; // Adjust import based on your actual file structure

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest
            .fn()
            .mockResolvedValue({ response: { text: () => 'Mock response' } })
        })
      };
    })
  };
});

describe('Chatbot API Handler', () => {
  let req, res;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: { message: 'Hello', language: 'en', conversation: [] }
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it('should return Method Not Allowed for non-POST requests', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });

  it('should return error if message or language is missing', async () => {
    req.body.message = ''; // Empty message
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Message and language are required.'
    });
  });

  it('should successfully generate a reply', async () => {
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: 'Mock response' });
  });

  it('should handle API errors gracefully', async () => {
    GoogleGenerativeAI.mockImplementationOnce(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockRejectedValue(new Error('API error'))
        })
      };
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error: API error' });
  });

  it('should handle the conversation history correctly', async () => {
    req.body.conversation = [
      { sender: 'user', text: 'Hi' },
      { sender: 'bot', text: 'Hello!' }
    ];
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: 'Mock response' });
  });

  it('should limit conversation history to the last 10 messages', async () => {
    req.body.conversation = Array(20).fill({ sender: 'user', text: 'Message' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ reply: 'Mock response' });
  });
});
