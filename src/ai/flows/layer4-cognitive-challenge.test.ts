import { layer4CognitiveChallenge } from './layer4-cognitive-challenge';

// Mock genkit ai definition to just return the handlers
jest.mock('@/ai/genkit', () => {
  return {
    ai: {
      defineTool: jest.fn((config, handler) => handler),
      defineFlow: jest.fn((config, handler) => handler),
    }
  };
});

describe('layer4CognitiveChallenge', () => {
  const originalMathRandom = Math.random;

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    // Reset Math.random to default before each test
    Math.random = originalMathRandom;
  });

  afterAll(() => {
    Math.random = originalMathRandom;
  });

  describe('trivia challenge', () => {
    it('should successfully fetch and decode a trivia question', async () => {
      const mockTriviaResponse = {
        results: [
          {
            question: 'What is the capital of &quot;France&quot;?',
            correct_answer: 'Paris',
            incorrect_answers: ['London', 'Berlin', 'Rome']
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTriviaResponse)
      });

      // Mock Math.random to not shuffle randomly for predictable testing if needed,
      // though the test only checks content inclusion.

      const result = await layer4CognitiveChallenge({ challengeType: 'trivia' });

      expect(global.fetch).toHaveBeenCalledWith('https://opentdb.com/api.php?amount=1&type=multiple');
      expect(result.type).toBe('trivia');
      expect(result.question).toBe('What is the capital of "France"?');
      expect(result.answer).toBe('Paris');
      expect(result.content).toContain('What is the capital of "France"?');
      expect(result.content).toContain('Paris');
      expect(result.content).toContain('London');
      expect(result.content).toContain('Berlin');
      expect(result.content).toContain('Rome');
    });

    it('should throw an error if the trivia API fetch fails (!ok)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error'
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'trivia' }))
        .rejects
        .toThrow('Failed to fetch trivia: Internal Server Error');
    });

    it('should throw an error if the trivia API returns no results', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ results: [] })
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'trivia' }))
        .rejects
        .toThrow('No trivia question found.');
    });
  });

  describe('fact challenge', () => {
    it('should successfully fetch a random fact', async () => {
      const mockFactResponse = {
        text: 'A random useless fact.'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockFactResponse)
      });

      const result = await layer4CognitiveChallenge({ challengeType: 'fact' });

      expect(global.fetch).toHaveBeenCalledWith('https://uselessfacts.jsph.pl/random.json?language=en');
      expect(result.type).toBe('fact');
      expect(result.content).toBe('A random useless fact.');
      expect(result.question).toBeUndefined();
      expect(result.answer).toBeUndefined();
    });

    it('should throw an error if the fact API fetch fails (!ok)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'fact' }))
        .rejects
        .toThrow('Failed to fetch fact: Not Found');
    });

    it('should throw an error if the fact API returns no text', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({})
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'fact' }))
        .rejects
        .toThrow('No random fact found.');
    });
  });

  describe('joke challenge', () => {
    it('should successfully fetch a random joke', async () => {
      const mockJokeResponse = {
        joke: 'Why did the chicken cross the road? To get to the other side.'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockJokeResponse)
      });

      const result = await layer4CognitiveChallenge({ challengeType: 'joke' });

      expect(global.fetch).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist,explicit&type=single');
      expect(result.type).toBe('joke');
      expect(result.content).toBe('Why did the chicken cross the road? To get to the other side.');
    });

    it('should throw an error if the joke API fetch fails (!ok)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'joke' }))
        .rejects
        .toThrow('Failed to fetch joke: Bad Request');
    });

    it('should throw an error if the joke API returns no joke', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({})
      });

      await expect(layer4CognitiveChallenge({ challengeType: 'joke' }))
        .rejects
        .toThrow('No random joke found.');
    });
  });

  describe('random challenge selection', () => {
    it('should randomly select a trivia challenge when no type is provided', async () => {
      // Mock Math.random to return 0 for the first element ('trivia')
      Math.random = jest.fn().mockReturnValue(0);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          results: [{ question: 'Q', correct_answer: 'A', incorrect_answers: [] }]
        })
      });

      await layer4CognitiveChallenge({});
      expect(global.fetch).toHaveBeenCalledWith('https://opentdb.com/api.php?amount=1&type=multiple');
    });

    it('should randomly select a fact challenge when no type is provided', async () => {
      // Mock Math.random to return 0.5 (floor(0.5 * 3) = 1 for 'fact')
      Math.random = jest.fn().mockReturnValue(0.5);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ text: 'Fact' })
      });

      await layer4CognitiveChallenge({});
      expect(global.fetch).toHaveBeenCalledWith('https://uselessfacts.jsph.pl/random.json?language=en');
    });

    it('should randomly select a joke challenge when no type is provided', async () => {
      // Mock Math.random to return 0.9 (floor(0.9 * 3) = 2 for 'joke')
      Math.random = jest.fn().mockReturnValue(0.9);

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ joke: 'Joke' })
      });

      await layer4CognitiveChallenge({});
      expect(global.fetch).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist,explicit&type=single');
    });
  });

  describe('HTML entity decoding', () => {
      it('should decode a variety of HTML entities correctly in trivia challenges', async () => {
          const mockTriviaResponse = {
            results: [
              {
                question: 'It&#039;s &amp; &eacute; &ouml; &rsquo; &shy; &ldquo; &rdquo; &aring; &auml; &egrave; &ecirc; &iacute; &iuml; &ntilde; &ograve; &ugrave; &uuml;',
                correct_answer: '&quot;Answer&quot;',
                incorrect_answers: []
              }
            ]
          };

          (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockTriviaResponse)
          });

          Math.random = jest.fn().mockReturnValue(0.5); // Predictable shuffle

          const result = await layer4CognitiveChallenge({ challengeType: 'trivia' });

          expect(result.question).toBe("It's & é ö '  \" \" å ä è ê í ï ñ ò ù ü");
          expect(result.answer).toBe('"Answer"');
      });
  })
});
