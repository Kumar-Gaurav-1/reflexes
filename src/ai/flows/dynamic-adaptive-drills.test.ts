import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import * as genkitModule from '@/ai/genkit';
import type { DynamicAdaptiveDrillsInput } from './dynamic-adaptive-drills';

// We must mock before importing the module under test since it calls definePrompt on load
const promptMock = mock.fn<(...args: any[]) => Promise<any>>();
mock.method(genkitModule.ai, 'definePrompt', () => {
  return async (...args: any[]) => {
    return promptMock(...args);
  };
});

describe('dynamicAdaptiveDrills fallback', () => {
  it('should return fallback output when AI flow encounters an API error (e.g. 429 quota)', async () => {

    // Dynamically import the module to ensure it evaluates after the mock is in place
    const { dynamicAdaptiveDrills } = await import('./dynamic-adaptive-drills');

    // Make the mock prompt throw an error simulating a Genkit rate limit/error
    promptMock.mock.mockImplementation(async () => {
      throw new Error('Genkit AI limit reached / Resource Exhausted');
    });

    const input: DynamicAdaptiveDrillsInput = {
      sport: 'basketball',
      currentPerformanceData: 'average',
      lastDrillOutcome: 'failure',
      skillLevel: 'intermediate',
    };

    const result = await dynamicAdaptiveDrills(input);

    // Verify the Sovereign Baseline Protocol fallback logic
    assert.strictEqual(
      result.drillName,
      'Sovereign Basketball Protocol',
      'Fallback drill name should include capitalized sport'
    );
    assert.strictEqual(
      result.difficultyAdjustment,
      'maintained',
      'Fallback difficulty adjustment should be "maintained"'
    );
    assert.ok(
      result.drillDescription.includes('calibrate your neural baseline for basketball'),
      'Fallback drill description should reference the sport'
    );
    assert.ok(
      result.reasoning.includes('quota limited'),
      'Fallback reasoning should indicate the quota limitation'
    );
    assert.deepStrictEqual(
      result.arElements,
      ['Kinetic AR Targets', 'Neural Scan Overlay', 'Spatial Boundaries'],
      'Fallback AR elements should be correct'
    );
    assert.deepStrictEqual(
      result.apiIntegrations,
      ['Local Biometric Cache'],
      'Fallback API integrations should be correct'
    );
  });

  it('should return fallback output when AI flow returns no output', async () => {

    // Dynamically import the module to ensure it evaluates after the mock is in place
    const { dynamicAdaptiveDrills } = await import('./dynamic-adaptive-drills');

    // Make the mock prompt return no output
    promptMock.mock.mockImplementation(async () => {
      return { output: null };
    });

    const input: DynamicAdaptiveDrillsInput = {
      sport: 'boxing',
      currentPerformanceData: 'average',
      lastDrillOutcome: 'failure',
      skillLevel: 'intermediate',
    };

    const result = await dynamicAdaptiveDrills(input);

    assert.strictEqual(
      result.drillName,
      'Sovereign Boxing Protocol'
    );
    assert.strictEqual(
      result.difficultyAdjustment,
      'maintained'
    );
  });
});
