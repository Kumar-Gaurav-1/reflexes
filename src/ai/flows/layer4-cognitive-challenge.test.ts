import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { layer4CognitiveChallenge } from './layer4-cognitive-challenge';

describe('layer4CognitiveChallenge', () => {
  let originalFetch: typeof fetch;
  let originalRandom: typeof Math.random;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalRandom = Math.random;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Math.random = originalRandom;
    mock.restoreAll();
  });

  describe('trivia', () => {
    it('should successfully fetch and decode a trivia challenge', async () => {
      global.fetch = mock.fn(async (url: string | URL | Request) => {
        if (url.toString().includes('opentdb.com')) {
          return {
            ok: true,
            json: async () => ({
              results: [{
                question: 'What is 2 &amp; 2?',
                correct_answer: '4 &amp; 0',
                incorrect_answers: ['1', '2', '3']
              }]
            })
          } as Response;
        }
        throw new Error('Unexpected URL');
      });

      const result = await layer4CognitiveChallenge({ challengeType: 'trivia' });
      assert.strictEqual(result.type, 'trivia');
      assert.strictEqual(result.question, 'What is 2 & 2?');
      assert.strictEqual(result.answer, '4 & 0');
      assert.ok(result.content.includes('What is 2 & 2?'));
      assert.ok(result.content.includes('4 & 0'));
    });

    it('should throw an error if fetch fails', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: false, statusText: 'Not Found' } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'trivia' }),
        /Failed to fetch trivia: Not Found/
      );
    });

    it('should throw an error if no trivia question is found', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: true, json: async () => ({ results: [] }) } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'trivia' }),
        /No trivia question found/
      );
    });
  });

  describe('fact', () => {
    it('should successfully fetch a random fact', async () => {
      global.fetch = mock.fn(async (url: string | URL | Request) => {
        if (url.toString().includes('uselessfacts.jsph.pl')) {
          return {
            ok: true,
            json: async () => ({ text: 'This is a useless fact.' })
          } as Response;
        }
        throw new Error('Unexpected URL');
      });

      const result = await layer4CognitiveChallenge({ challengeType: 'fact' });
      assert.strictEqual(result.type, 'fact');
      assert.strictEqual(result.content, 'This is a useless fact.');
    });

    it('should throw an error if fetch fails', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: false, statusText: 'Internal Server Error' } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'fact' }),
        /Failed to fetch fact: Internal Server Error/
      );
    });

    it('should throw an error if no fact is found', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: true, json: async () => ({}) } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'fact' }),
        /No random fact found/
      );
    });
  });

  describe('joke', () => {
    it('should successfully fetch a random joke', async () => {
      global.fetch = mock.fn(async (url: string | URL | Request) => {
        if (url.toString().includes('jokeapi.dev')) {
          return {
            ok: true,
            json: async () => ({ joke: 'This is a joke.' })
          } as Response;
        }
        throw new Error('Unexpected URL');
      });

      const result = await layer4CognitiveChallenge({ challengeType: 'joke' });
      assert.strictEqual(result.type, 'joke');
      assert.strictEqual(result.content, 'This is a joke.');
    });

    it('should throw an error if fetch fails', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: false, statusText: 'Gateway Timeout' } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'joke' }),
        /Failed to fetch joke: Gateway Timeout/
      );
    });

    it('should throw an error if no joke is found', async () => {
      global.fetch = mock.fn(async () => {
        return { ok: true, json: async () => ({}) } as Response;
      });

      await assert.rejects(
        () => layer4CognitiveChallenge({ challengeType: 'joke' }),
        /No random joke found/
      );
    });
  });

  describe('random fallback', () => {
    it('should select a challenge type randomly when none is provided', async () => {
      // Mock Math.random to return 0.9, which corresponds to the last element ('joke')
      Math.random = () => 0.9;

      global.fetch = mock.fn(async (url: string | URL | Request) => {
        if (url.toString().includes('jokeapi.dev')) {
          return {
            ok: true,
            json: async () => ({ joke: 'Random joke.' })
          } as Response;
        }
        throw new Error('Unexpected URL');
      });

      const result = await layer4CognitiveChallenge({});
      assert.strictEqual(result.type, 'joke');
      assert.strictEqual(result.content, 'Random joke.');
    });

    it('should select a challenge type randomly when none is provided (trivia)', async () => {
      // Mock Math.random to return 0.1, which corresponds to the first element ('trivia')
      Math.random = () => 0.1;

      global.fetch = mock.fn(async (url: string | URL | Request) => {
        if (url.toString().includes('opentdb.com')) {
          return {
            ok: true,
            json: async () => ({
              results: [{
                question: 'Q',
                correct_answer: 'A',
                incorrect_answers: []
              }]
            })
          } as Response;
        }
        throw new Error('Unexpected URL');
      });

      const result = await layer4CognitiveChallenge({});
      assert.strictEqual(result.type, 'trivia');
    });
  });
});
