import { BrewMethod, BrewMethodId, BrewParameters, EspressoParameters, PourOverParameters, FilterCoffeeParameters, TurkishCoffeeParameters } from '../types';
import { RatioDefinition, CANONICAL_RATIOS } from '../types';

export interface BrewMethodDefinition {
  id: BrewMethodId;
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

// ============================================
// Recommendation Rules
// ============================================

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

const filterCoffeeRules: RecommendationRule[] = [
  {
    condition: 'brewTime < 3min && taste === sour',
    suggestion: 'grind_finer',
    priority: 1,
  },
  {
    condition: 'brewTime > 5min && taste === bitter',
    suggestion: 'grind_coarser',
    priority: 1,
  },
];

const turkishRules: RecommendationRule[] = [
  {
    condition: 'taste === bitter',
    suggestion: 'reduce_heat',
    priority: 1,
  },
  {
    condition: 'no_foam',
    suggestion: 'heat_slower',
    priority: 1,
  },
];

const immersionRules: RecommendationRule[] = [
  {
    condition: 'taste === weak',
    suggestion: 'increase_steep_time',
    priority: 1,
  },
  {
    condition: 'taste === bitter',
    suggestion: 'decrease_steep_time',
    priority: 1,
  },
];

// ============================================
// Default Recipes
// ============================================

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
  grind: 40,
  temperature: 94,
  totalTime: 180,
  ratio: 16.0,
};

const filterCoffeeDefault: FilterCoffeeParameters = {
  coffee: 20,
  water: 320,
  grind: 45,
  temperature: 94,
  brewTime: 210,
  ratio: 16.0,
};

const turkishDefault: TurkishCoffeeParameters = {
  coffee: 7,
  water: 70,
  sugar: 0,
  temperature: 70,
  brewTime: 180,
};

const dripDefault: FilterCoffeeParameters = {
  coffee: 60,
  water: 1000,
  grind: 45,
  temperature: 94,
  brewTime: 300,
  ratio: 16.7,
};

const aeropressDefault: FilterCoffeeParameters = {
  coffee: 15,
  water: 200,
  grind: 40,
  temperature: 85,
  brewTime: 90,
  ratio: 13.3,
};

const frenchPressDefault: FilterCoffeeParameters = {
  coffee: 30,
  water: 500,
  grind: 30,
  temperature: 94,
  brewTime: 240,
  ratio: 16.7,
};

const chemexDefault: PourOverParameters = {
  coffee: 30,
  water: 500,
  grind: 45,
  temperature: 94,
  totalTime: 270,
  ratio: 16.7,
};

// ============================================
// Brew Method Registry
// ============================================

export const brewMethodRegistry: Map<BrewMethodId, BrewMethodDefinition> = new Map([
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
  [
    'v60',
    {
      id: 'v60',
      name: 'Hario V60',
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
  [
    'chemex',
    {
      id: 'chemex',
      name: 'Chemex',
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
      defaultRecipe: chemexDefault,
      recommendationRules: pourOverRules,
      defaultRatios: CANONICAL_RATIOS.filter((r) => r.brewMethod === 'pour_over'),
    },
  ],
  [
    'filter_coffee',
    {
      id: 'filter_coffee',
      name: 'Filter Coffee',
      parameterSchema: {
        required: ['coffee', 'water', 'grind', 'temperature', 'brewTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 80, max: 100 },
          brewTime: { type: 'number', min: 0 },
          ratio: { type: 'number', calculated: true },
        },
      },
      defaultRecipe: filterCoffeeDefault,
      recommendationRules: filterCoffeeRules,
      defaultRatios: CANONICAL_RATIOS.filter((r) => r.brewMethod === 'pour_over'),
    },
  ],
  [
    'turkish',
    {
      id: 'turkish',
      name: 'Turkish Coffee',
      parameterSchema: {
        required: ['coffee', 'water', 'temperature', 'brewTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          sugar: { type: 'number', min: 0, max: 4 },
          temperature: { type: 'number', min: 60, max: 90 },
          brewTime: { type: 'number', min: 0 },
        },
      },
      defaultRecipe: turkishDefault,
      recommendationRules: turkishRules,
      defaultRatios: [],
    },
  ],
  [
    'drip',
    {
      id: 'drip',
      name: 'Drip Coffee',
      parameterSchema: {
        required: ['coffee', 'water', 'grind', 'brewTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 80, max: 100 },
          brewTime: { type: 'number', min: 0 },
          ratio: { type: 'number', calculated: true },
        },
      },
      defaultRecipe: dripDefault,
      recommendationRules: filterCoffeeRules,
      defaultRatios: CANONICAL_RATIOS.filter((r) => r.brewMethod === 'pour_over'),
    },
  ],
  [
    'aeropress',
    {
      id: 'aeropress',
      name: 'AeroPress',
      parameterSchema: {
        required: ['coffee', 'water', 'grind', 'temperature', 'brewTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 70, max: 100 },
          brewTime: { type: 'number', min: 0 },
          ratio: { type: 'number', calculated: true },
        },
      },
      defaultRecipe: aeropressDefault,
      recommendationRules: immersionRules,
      defaultRatios: [],
    },
  ],
  [
    'french_press',
    {
      id: 'french_press',
      name: 'French Press',
      parameterSchema: {
        required: ['coffee', 'water', 'grind', 'temperature', 'brewTime'],
        properties: {
          coffee: { type: 'number', min: 0 },
          water: { type: 'number', min: 0 },
          grind: { type: 'number', min: 0, max: 100 },
          temperature: { type: 'number', min: 80, max: 100 },
          brewTime: { type: 'number', min: 0 },
          ratio: { type: 'number', calculated: true },
        },
      },
      defaultRecipe: frenchPressDefault,
      recommendationRules: immersionRules,
      defaultRatios: [],
    },
  ],
]);

export function getBrewMethodDefinition(method: BrewMethodId): BrewMethodDefinition | undefined {
  return brewMethodRegistry.get(method);
}

export function getAllBrewMethodDefinitions(): BrewMethodDefinition[] {
  return Array.from(brewMethodRegistry.values());
}

export function registerBrewMethod(definition: BrewMethodDefinition): void {
  brewMethodRegistry.set(definition.id, definition);
}

// Legacy export for backward compatibility
export const getAllBrewMethods = getAllBrewMethodDefinitions;

