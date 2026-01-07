import {
  EspressoParameters,
  Adjustment,
  TroubleshootingDiagnosis,
  TroubleshootingAnswer,
  RatioDefinition,
  Bean,
} from '../types';
import { calculateRatio } from '../utils/units';
import { getRecommendedRatio } from './ratioService';
import { getRecommendedParameters, getOriginFlavorNotes, getRoastFlavorFocus, getMatchingRecipes } from './seedDataService';
import type { RecommendedParameters } from './seedDataService';
import type { EspressoRecipe } from '../data/seedEspressoRecipes';

export interface ParameterSuggestions {
  ratio?: {
    current: number;
    recommended: number;
    reason: string;
  };
  grind?: {
    direction: 'finer' | 'coarser' | 'maintain';
    reason: string;
  };
  time?: {
    current: number;
    target: { min: number; max: number };
    reason: string;
  };
  temperature?: {
    current: number;
    target: { min: number; max: number };
    reason: string;
  };
}

export function suggestParametersFromRatio(
  ratio: RatioDefinition,
  currentShot: EspressoParameters,
  previousShots: EspressoParameters[]
): ParameterSuggestions {
  const suggestions: ParameterSuggestions = {
    time: ratio.targetTime
      ? {
          current: currentShot.time,
          target: ratio.targetTime,
          reason: `Target time for ${ratio.name} is ${ratio.targetTime.min}-${ratio.targetTime.max}s`,
        }
      : undefined,
    temperature: ratio.targetTemp
      ? {
          current: currentShot.temperature,
          target: ratio.targetTemp,
          reason: `Target temperature for ${ratio.name} is ${ratio.targetTemp.min}-${ratio.targetTemp.max}°C`,
        }
      : undefined,
  };

  // If current ratio differs from recommended, suggest adjustment
  const currentRatio = calculateRatio(
    currentShot.dose,
    'grams',
    currentShot.yield,
    'ml'
  );

  if (Math.abs(currentRatio - ratio.ratio) > 0.2) {
    suggestions.ratio = {
      current: currentRatio,
      recommended: ratio.ratio,
      reason: `For ${ratio.name}, try ${ratio.ratio}:1 ratio`,
    };
  }

  // Grind suggestions based on ratio + time
  if (ratio.targetTime) {
    if (currentShot.time < ratio.targetTime.min) {
      suggestions.grind = {
        direction: 'finer',
        reason: `Shot too fast (${currentShot.time}s) for ${ratio.name} (target: ${ratio.targetTime.min}-${ratio.targetTime.max}s). Try finer grind or longer ratio.`,
      };
    }

    if (currentShot.time > ratio.targetTime.max) {
      suggestions.grind = {
        direction: 'coarser',
        reason: `Shot too slow (${currentShot.time}s) for ${ratio.name}. Try coarser grind or shorter ratio.`,
      };
    }
  }

  return suggestions;
}

export function diagnoseTroubleshooting(
  answers: TroubleshootingAnswer,
  currentShot: EspressoParameters,
  selectedRatio: RatioDefinition
): TroubleshootingDiagnosis {
  // Rule 1: Channeling (highest priority)
  if (answers.flow === 'channeling' || answers.puck === 'channeling') {
    return {
      primaryAdjustment: {
        type: 'distribution',
        direction: 'improve',
        magnitude: 'moderate',
        reason: 'Uneven extraction detected. Focus on even distribution.',
      },
      secondaryAdjustment: {
        type: 'grind',
        direction: 'finer',
        magnitude: 'slight',
        reason: 'Finer grind can help reduce channeling',
      },
      explanation:
        'Your shot shows signs of channeling—water finding paths of least resistance. This causes uneven extraction. Focus on even coffee distribution in the portafilter before tamping.',
      confidence: 'high',
    };
  }

  // Rule 2: Sour + Fast = Under-extraction
  if (
    answers.taste === 'sour' &&
    answers.flow === 'too_fast' &&
    answers.timing !== undefined &&
    answers.timing < 25
  ) {
    return {
      primaryAdjustment: {
        type: 'grind',
        direction: 'finer',
        magnitude: 'moderate',
        reason: 'Fast flow and sour taste indicate under-extraction',
      },
      secondaryAdjustment: {
        type: 'ratio',
        direction: 'longer',
        magnitude: 'slight',
        reason: 'Slightly longer ratio (1:2.2) can help extraction',
      },
      explanation:
        'Your shot is extracting too quickly, resulting in sour, under-extracted flavors. Grinding finer will slow the flow and increase extraction.',
      confidence: 'high',
    };
  }

  // Rule 3: Bitter + Slow = Over-extraction
  if (
    answers.taste === 'bitter' &&
    answers.flow === 'too_slow' &&
    answers.timing !== undefined &&
    answers.timing > 30
  ) {
    return {
      primaryAdjustment: {
        type: 'grind',
        direction: 'coarser',
        magnitude: 'moderate',
        reason: 'Slow flow and bitter taste indicate over-extraction',
      },
      secondaryAdjustment: {
        type: 'ratio',
        direction: 'shorter',
        magnitude: 'slight',
        reason: 'Shorter ratio (1:1.8) can reduce bitterness',
      },
      explanation:
        'Your shot is extracting too slowly, pulling out bitter compounds. Grinding coarser will speed up the flow and reduce over-extraction.',
      confidence: 'high',
    };
  }

  // Rule 4: Weak + Fast = Need more coffee
  if (answers.taste === 'weak' && answers.flow === 'too_fast') {
    return {
      primaryAdjustment: {
        type: 'dose',
        direction: 'increase',
        magnitude: 'moderate',
        reason: 'Weak taste and fast flow suggest insufficient coffee',
      },
      secondaryAdjustment: {
        type: 'grind',
        direction: 'finer',
        magnitude: 'slight',
        reason: 'Finer grind will slow extraction',
      },
      explanation:
        'Your shot tastes weak and flows too fast. Increasing the dose (try +0.5g) will add more coffee to extract, improving body and strength.',
      confidence: 'high',
    };
  }

  // Rule 5: Balanced but timing off
  if (answers.taste === 'balanced' && answers.timing !== undefined) {
    if (answers.timing < 25) {
      return {
        primaryAdjustment: {
          type: 'grind',
          direction: 'finer',
          magnitude: 'slight',
          reason: 'Taste is good but shot is fast—finer grind will improve consistency',
        },
        explanation:
          'Your shot tastes balanced but is extracting quickly. A slightly finer grind will slow it down and may improve consistency.',
        confidence: 'medium',
      };
    }
    if (answers.timing > 30) {
      return {
        primaryAdjustment: {
          type: 'grind',
          direction: 'coarser',
          magnitude: 'slight',
          reason: 'Taste is good but shot is slow—coarser grind will speed it up',
        },
        explanation:
          'Your shot tastes balanced but is extracting slowly. A slightly coarser grind will speed it up without sacrificing taste.',
        confidence: 'medium',
      };
    }
  }

  // Default: Balanced shot
  return {
    primaryAdjustment: {
      type: 'grind',
      direction: 'maintain',
      magnitude: 'slight',
      reason: 'Your shot parameters look good',
    },
    explanation:
      'Your shot appears well-balanced. Consider logging this as a reference point for this bean.',
    confidence: 'high',
  };
}

export function suggestGrindAdjustment(
  currentShot: EspressoParameters,
  previousShots: EspressoParameters[],
  tasteRating?: number
): Adjustment | null {
  // Rule 1: Time-based adjustment
  if (currentShot.time < 20) {
    return {
      type: 'grind',
      direction: 'finer',
      magnitude: 'moderate',
      reason: 'Shot too fast (under 20s)',
    };
  }
  if (currentShot.time > 35) {
    return {
      type: 'grind',
      direction: 'coarser',
      magnitude: 'moderate',
      reason: 'Shot too slow (over 35s)',
    };
  }

  // Rule 2: Taste-based (if rating provided)
  if (tasteRating !== undefined && tasteRating < 3) {
    if (currentShot.time < 25) {
      return {
        type: 'grind',
        direction: 'finer',
        magnitude: 'moderate',
        reason: 'Sour taste suggests under-extraction',
      };
    }
    if (currentShot.time > 30) {
      return {
        type: 'grind',
        direction: 'coarser',
        magnitude: 'moderate',
        reason: 'Bitter taste suggests over-extraction',
      };
    }
  }

  // Rule 3: Trend-based (compare to last 3 shots)
  if (previousShots.length >= 3) {
    const recentShots = previousShots.slice(-3);
    const avgTime =
      recentShots.reduce((sum, s) => sum + s.time, 0) / recentShots.length;
    if (currentShot.time < avgTime - 3 && tasteRating !== undefined && tasteRating < 4) {
      return {
        type: 'grind',
        direction: 'finer',
        magnitude: 'slight',
        reason: 'Time decreasing, try finer',
      };
    }
  }

  return null;
}

export function suggestTemperature(roastLevel: string): number {
  const temps: Record<string, number> = {
    light: 94,
    medium: 92,
    dark: 90,
    espresso: 93,
  };
  return temps[roastLevel] || 92;
}

export function getRecommendationsForBean(bean: Bean): {
  parameters: RecommendedParameters;
  flavorNotes: string[];
  flavorFocus: string[];
  matchingRecipes: EspressoRecipe[];
} {
  const parameters = getRecommendedParameters(bean);
  const flavorNotes = getOriginFlavorNotes(bean.origin || '');
  const flavorFocus = getRoastFlavorFocus(bean.roastLevel);
  const matchingRecipes = getMatchingRecipes(bean);

  return {
    parameters,
    flavorNotes,
    flavorFocus,
    matchingRecipes,
  };
}

