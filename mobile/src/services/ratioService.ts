import { RatioDefinition, CANONICAL_RATIOS, RoastLevel, BrewMethod } from '../types';

export function getRecommendedRatio(
  roastLevel: RoastLevel,
  brewMethod: BrewMethod
): RatioDefinition {
  // Filter by method and roast level
  const candidates = CANONICAL_RATIOS.filter(
    (r) =>
      r.brewMethod === brewMethod &&
      (!r.roastLevels || r.roastLevels.includes(roastLevel))
  );

  // Default selection logic
  if (brewMethod === 'espresso') {
    if (roastLevel === 'dark') {
      return candidates.find((r) => r.id === 'espresso_ristretto') || candidates[0];
    }
    if (roastLevel === 'light') {
      return candidates.find((r) => r.id === 'espresso_lungo') || candidates[0];
    }
    return candidates.find((r) => r.id === 'espresso_standard') || candidates[0];
  }

  // Default for filter methods
  return candidates[0] || CANONICAL_RATIOS.find((r) => r.brewMethod === brewMethod)!;
}

export function getRatioById(id: string): RatioDefinition | undefined {
  return CANONICAL_RATIOS.find((r) => r.id === id);
}

export function getAllRatiosForMethod(brewMethod: BrewMethod): RatioDefinition[] {
  return CANONICAL_RATIOS.filter((r) => r.brewMethod === brewMethod);
}

