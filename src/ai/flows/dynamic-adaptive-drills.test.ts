import { test, mock, describe, it, beforeEach, afterEach } from 'node:test';
import * as assert from 'node:assert';
import { ai } from '../genkit';

let mockThrow = false;
let mockOutput = false;

const mockPromptObj = Object.assign(
  async (input: any) => {
    if (mockThrow) {
      throw new Error("Quota exceeded");
    }
    if (!mockOutput) {
       return { output: null };
    }
    return {
      output: {
        drillName: 'Awesome Drill',
        drillDescription: 'Do this',
        difficultyAdjustment: 'increased',
        reasoning: 'Because',
        arElements: ['ball'],
        apiIntegrations: [],
      }
    };
  },
  {
    __isMock: true
  }
);

mock.method(ai, 'definePrompt', () => mockPromptObj);

describe('dynamicAdaptiveDrills', () => {
  const originalConsoleWarn = console.warn;
  let warnings: any[] = [];
  let dynamicAdaptiveDrills: any;

  beforeEach(async () => {
    mockThrow = false;
    mockOutput = true;
    warnings = [];
    console.warn = (...args) => {
      warnings.push(args);
    };
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('should return AI generated drill on success', async () => {
    mockThrow = false;
    mockOutput = true;
    const module = await import('./dynamic-adaptive-drills');
    dynamicAdaptiveDrills = module.dynamicAdaptiveDrills;

    const input = { sport: 'tennis', currentPerformanceData: '', lastDrillOutcome: 'success', skillLevel: 'beginner' };
    const result = await dynamicAdaptiveDrills(input);
    assert.strictEqual(result.drillName, 'Awesome Drill');
    assert.strictEqual(warnings.length, 0);
  });

  it('should return Sovereign Baseline Protocol fallback on AI error', async () => {
    mockThrow = true;
    mockOutput = true;
    const module = await import('./dynamic-adaptive-drills');
    dynamicAdaptiveDrills = module.dynamicAdaptiveDrills;

    const input = { sport: 'basketball', currentPerformanceData: '', lastDrillOutcome: 'success', skillLevel: 'elite' };
    const result = await dynamicAdaptiveDrills(input);
    assert.strictEqual(result.drillName, 'Sovereign Basketball Protocol');
    assert.strictEqual(result.difficultyAdjustment, 'maintained');
    assert.ok(result.reasoning.includes('quota limited'));
    assert.strictEqual(warnings.length, 1);
    assert.ok(warnings[0][0].includes('Genkit AI limit reached'));
  });

  it('should return Sovereign Baseline Protocol fallback on missing output', async () => {
    mockThrow = false;
    mockOutput = false;
    const module = await import('./dynamic-adaptive-drills');
    dynamicAdaptiveDrills = module.dynamicAdaptiveDrills;

    const input = { sport: 'tennis', currentPerformanceData: '', lastDrillOutcome: 'success', skillLevel: 'elite' };
    const result = await dynamicAdaptiveDrills(input);
    assert.strictEqual(result.drillName, 'Sovereign Tennis Protocol');
    assert.strictEqual(result.difficultyAdjustment, 'maintained');
    assert.ok(result.reasoning.includes('quota limited'));
    assert.strictEqual(warnings.length, 1);
  });
});
