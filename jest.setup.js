import 'cross-fetch/polyfill';
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));
