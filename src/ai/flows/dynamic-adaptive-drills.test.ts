import { describe, it, expect, vi } from 'vitest';

vi.mock('@/ai/genkit', () => ({
  ai: {
    definePrompt: vi.fn(() => vi.fn().mockRejectedValue(new Error('Rate Limit Exceeded'))),
    defineFlow: vi.fn((config, fn) => fn),
  }
}));

import { dynamicAdaptiveDrills } from './dynamic-adaptive-drills';

describe('dynamicAdaptiveDrills fallback', () => {
  it('should return fallback protocol if AI throws an error', async () => {
    const input = {
      sport: 'soccer',
      currentPerformanceData: 'Decent passing',
      lastDrillOutcome: 'partial_success' as const,
      skillLevel: 'intermediate' as const
    };

    const result = await dynamicAdaptiveDrills(input);

    expect(result.drillName).toBe('Sovereign Soccer Protocol');
    expect(result.drillDescription).toBe('A high-intensity spatial reflex session designed to calibrate your neural baseline for soccer. Neutralize AR targets using kinetic hand movements within your field of vision.');
    expect(result.difficultyAdjustment).toBe('maintained');
    expect(result.reasoning).toBe('The adaptive engine is currently synchronizing or quota limited. Reverting to the professional baseline protocol to maintain training momentum.');
    expect(result.arElements).toEqual(['Kinetic AR Targets', 'Neural Scan Overlay', 'Spatial Boundaries']);
    expect(result.apiIntegrations).toEqual(['Local Biometric Cache']);
  });
});
