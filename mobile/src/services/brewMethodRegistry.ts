import { BrewMethod, BrewParameters, EspressoParameters, PourOverParameters } from '../types';
import { RatioDefinition, CANONICAL_RATIOS } from '../types';

export interface BrewMethodDefinition {
  id: BrewMethod;
  name: string;
  parameterSchema: {
    required: string[];
    properties: Record<string, any>;
  };
  defaultRecipe: BrewParameters;
  recommendationRules: RecommendationRule[];
  defaultRatios: RatioDefinition[];
}

export interface RecommendationRule {
  condition: string;
  suggestion: string;
  priority: number;
}

const espressoRules: RecommendationRule[] = [
  {
    condition: 'time < 20 && taste === sour',
    suggestion: 'grind_finer',
    priority: 1,
  },
  {
    condition: 'time > 35 && taste === bitter',
    suggestion: 'grind_coarser',
    priority: 1,
  },
  {
    condition: 'taste === weak && flow === fast',
    suggestion: 'increase_dose',
    priority: 2,
  },
];

const pourOverRules: RecommendationRule[] = [
  {
    condition: 'brewTime < 2min && taste === sour',
    suggestion: 'grind_finer',
    priority: 1,
  },
  {
    condition: 'brewTime > 4min && taste === bitter',
    suggestion: 'grind_coarser',
    priority: 1,
  },
];

const espressoDefault: EspressoParameters = {
  dose: 18,
  yield: 36,
  time: 28,
  grind: 50,
  temperature: 92,
  ratio: 2.0,
};

const pourOverDefault: PourOverParameters = {
  coffee: 20,
  water: 320,
  grind: 30,
  temperature: 93,
  totalTime: 180,
  ratio: 16.0,
};

export const brewMethodRegistry: Map<BrewMethod, BrewMethodDefinition> = new Map([
  [
    'espresso',
    {
      id: 'espresso',
      name: 'Espresso',
      parameterSchema: {
        required: ['dose', 'yield', 'time', 'grind', 'temperature'],
        properties: {
          dose: { type: 'number', min: 0 },
          yield: { type: 'number', min: 0 },
          time: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 80, max: 100 },
          pressure: { type: 'number', min: 0, max: 15 },
          preInfusionTime: { type: 'number', min: 0 },
          ratio: { type: 'number', calculated: true },
          tds: { type: 'number', min: 0, max: 100 },
          extraction: { type: 'number', min: 0, max: 100 },
        },
      },
      defaultRecipe: espressoDefault,
      recommendationRules: espressoRules,
      defaultRatios: CANONICAL_RATIOS.filter((r) => r.brewMethod === 'espresso'),
    },
  ],
  [
    'pour_over',
    {
      id: 'pour_over',
      name: 'Pour Over',
      parameterSchema: {
        required: ['coffee', 'water', 'grind', 'temperature', 'totalTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 80, max: 100 },
          bloomTime: { type: 'number', min: 0 },
          totalTime: { type: 'number', min: 0 },
          pourStages: { type: 'array' },
          ratio: { type: 'number', calculated: true },
        },
      },
      defaultRecipe: pourOverDefault,
      recommendationRules: pourOverRules,
      defaultRatios: CANONICAL_RATIOS.filter((r) => r.brewMethod === 'pour_over'),
    },
  ],
]);

export function getBrewMethodDefinition(method: BrewMethod): BrewMethodDefinition | undefined {
  return brewMethodRegistry.get(method);
}

export function getAllBrewMethods(): BrewMethodDefinition[] {
  return Array.from(brewMethodRegistry.values());
}

export function registerBrewMethod(definition: BrewMethodDefinition): void {
  brewMethodRegistry.set(definition.id, definition);
}

