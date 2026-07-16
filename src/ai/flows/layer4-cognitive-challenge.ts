'use server';
/**
 * @fileOverview A Genkit flow for generating cognitive distractions during physical drills.
 * This flow provides strategically timed cognitive challenges (trivia, facts, or jokes)
 * to train decision-making and reaction speed under mental pressure.
 *
 * - layer4CognitiveChallenge - A function that handles the generation of a cognitive challenge.
 * - Layer4CognitiveChallengeInput - The input type for the layer4CognitiveChallenge function.
 * - Layer4CognitiveChallengeOutput - The return type for the layer4CognitiveChallenge function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the cognitive challenge
const Layer4CognitiveChallengeInputSchema = z.object({
  challengeType: z
    .enum(['trivia', 'fact', 'joke'])
    .optional()
    .describe('The type of cognitive challenge to generate. Defaults to a random type.'),
});
export type Layer4CognitiveChallengeInput = z.infer<typeof Layer4CognitiveChallengeInputSchema>;

// Output schema for the cognitive challenge
const Layer4CognitiveChallengeOutputSchema = z.object({
  type: z.string().describe('The type of challenge generated (e.g., "trivia", "fact", "joke").'),
  question: z.string().optional().describe('The question for trivia challenges.'),
  content: z.string().describe('The main content of the challenge (e.g., fact, joke, or combined question/answer for trivia).'),
  answer: z.string().optional().describe('The answer for trivia challenges.'),
});
export type Layer4CognitiveChallengeOutput = z.infer<typeof Layer4CognitiveChallengeOutputSchema>;

// Helper to decode basic HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é')
    .replace(/&ouml;/g, 'ö')
    .replace(/&rsquo;/g, "'")
    .replace(/&shy;/g, '')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&aring;/g, 'å')
    .replace(/&auml;/g, 'ä')
    .replace(/&egrave;/g, 'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&iacute;/g, 'í')
    .replace(/&iuml;/g, 'ï')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&ograve;/g, 'ò')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&uuml;/g, 'ü');
}

// Caches for API responses to reduce network calls and improve performance
const triviaCache: Layer4CognitiveChallengeOutput[] = [];
const jokeCache: Layer4CognitiveChallengeOutput[] = [];
const factCache: Layer4CognitiveChallengeOutput[] = [];

// Helper function to fetch a trivia question from Open Trivia DB
async function fetchTriviaQuestion(): Promise<Layer4CognitiveChallengeOutput> {
  if (triviaCache.length > 0) {
    return triviaCache.pop()!;
  }

  // Fetch a batch of questions to avoid rate limits and speed up subsequent calls
  const response = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
  if (!response.ok) {
    throw new Error(`Failed to fetch trivia: ${response.statusText}`);
  }
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const formattedQuestions = data.results.map((trivia: any) => {
      const question = decodeHtmlEntities(trivia.question);
      const answer = decodeHtmlEntities(trivia.correct_answer);
      const choices = [trivia.correct_answer, ...trivia.incorrect_answers]
        .map(decodeHtmlEntities)
        .sort(() => Math.random() - 0.5); // Shuffle choices

      return {
        type: 'trivia',
        question: question,
        content: `${question}\nChoices: ${choices.join(', ')}`,
        answer: answer,
      };
    });

    // Populate cache with all but the first question
    triviaCache.push(...formattedQuestions.slice(1));
    return formattedQuestions[0];
  }
  throw new Error('No trivia question found.');
}

// Helper function to fetch a random fact
async function fetchRandomFact(): Promise<Layer4CognitiveChallengeOutput> {
  if (factCache.length > 0) {
    return factCache.pop()!;
  }

  // Fetch a batch of facts concurrently to avoid 301 redirects and speed up subsequent calls
  // The API doesn't support the amount parameter as expected on this endpoint, so we fire 5 concurrent requests
  const requests = Array(5).fill(0).map(() =>
    fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en').then(res => {
      if (!res.ok) throw new Error(`Failed to fetch fact: ${res.statusText}`);
      return res.json();
    })
  );

  const results = await Promise.all(requests);
  const formattedFacts = results
    .filter((data: any) => data && data.text)
    .map((data: any) => ({
      type: 'fact',
      content: data.text,
    }));

  if (formattedFacts.length > 0) {
    factCache.push(...formattedFacts.slice(1));
    return formattedFacts[0];
  }

  throw new Error('No random fact found.');
}

// Helper function to fetch a random joke
async function fetchRandomJoke(): Promise<Layer4CognitiveChallengeOutput> {
  if (jokeCache.length > 0) {
    return jokeCache.pop()!;
  }

  // Fetch a batch of jokes to speed up subsequent calls
  const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist,explicit&type=single&amount=10');
  if (!response.ok) {
    throw new Error(`Failed to fetch joke: ${response.statusText}`);
  }
  const data = await response.json();

  if (data.jokes && data.jokes.length > 0) {
    const formattedJokes = data.jokes.map((jokeData: any) => ({
      type: 'joke',
      content: jokeData.joke,
    }));

    jokeCache.push(...formattedJokes.slice(1));
    return formattedJokes[0];
  } else if (data.joke) {
     return {
         type: 'joke',
         content: data.joke
     }
  }
  throw new Error('No random joke found.');
}

// Define the Genkit tool to get a cognitive challenge
const getCognitiveChallengeTool = ai.defineTool(
  {
    name: 'getCognitiveChallenge',
    description: 'Retrieves a cognitive challenge (trivia, fact, or joke) to distract the user during training.',
    inputSchema: Layer4CognitiveChallengeInputSchema,
    outputSchema: Layer4CognitiveChallengeOutputSchema,
  },
  async (input) => {
    const challengeTypes = ['trivia', 'fact', 'joke'];
    const chosenType = input.challengeType || challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

    switch (chosenType) {
      case 'trivia':
        return fetchTriviaQuestion();
      case 'fact':
        return fetchRandomFact();
      case 'joke':
        return fetchRandomJoke();
      default:
        return fetchRandomFact();
    }
  }
);

// Define the Genkit flow
const layer4CognitiveChallengeFlow = ai.defineFlow(
  {
    name: 'layer4CognitiveChallengeFlow',
    inputSchema: Layer4CognitiveChallengeInputSchema,
    outputSchema: Layer4CognitiveChallengeOutputSchema,
  },
  async (input) => {
    // Call the tool directly to get the cognitive challenge
    const challenge = await getCognitiveChallengeTool(input);
    return challenge;
  }
);

// Wrapper function to be exported and used by the Next.js app
export async function layer4CognitiveChallenge(
  input: Layer4CognitiveChallengeInput
): Promise<Layer4CognitiveChallengeOutput> {
  return layer4CognitiveChallengeFlow(input);
}
