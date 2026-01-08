// Seed Data: Brew Recipes
// Default recipes for all brew methods

import { BrewRecipe, BrewMethodId } from '../types';
import { ESPRESSO_STEPS, POUR_OVER_STEPS, CHEMEX_STEPS, FILTER_COFFEE_STEPS, TURKISH_COFFEE_STEPS, DRIP_COFFEE_STEPS, AEROPRESS_STEPS, FRENCH_PRESS_STEPS, INDIAN_FILTER_STEPS, COLD_BREW_STEPS } from './seedBrewSteps';

const now = Date.now();

// ============================================
// Espresso Recipes
// ============================================

export const ESPRESSO_RECIPES: BrewRecipe[] = [
  {
    id: 'espresso-modern-standard',
    name: 'Modern Espresso',
    methodId: 'espresso',
    description: 'Balanced, reliable starting point for most beans.',
    coffeeG: 18,
    waterMl: 36,
    ratio: 2.0,
    grindSize: 50,
    temperatureC: 93,
    brewTimeSec: 28,
    steps: ESPRESSO_STEPS,
    isDefault: true,
    tags: ['balanced', 'versatile'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'espresso-ristretto',
    name: 'Ristretto',
    methodId: 'espresso',
    description: 'Short, intense shot with heavy body.',
    coffeeG: 18,
    waterMl: 27,
    ratio: 1.5,
    grindSize: 55,
    temperatureC: 91,
    brewTimeSec: 22,
    steps: ESPRESSO_STEPS,
    isDefault: false,
    tags: ['intense', 'dark roast'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'espresso-lungo',
    name: 'Lungo',
    methodId: 'espresso',
    description: 'Longer extraction for lighter roasts.',
    coffeeG: 18,
    waterMl: 45,
    ratio: 2.5,
    grindSize: 45,
    temperatureC: 95,
    brewTimeSec: 35,
    steps: ESPRESSO_STEPS,
    isDefault: false,
    tags: ['clarity', 'light roast'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'espresso-turbo',
    name: 'Turbo Shot',
    methodId: 'espresso',
    description: 'Fast, high-extraction modern technique.',
    coffeeG: 18,
    waterMl: 72,
    ratio: 4.0,
    grindSize: 35,
    temperatureC: 93,
    brewTimeSec: 18,
    steps: ESPRESSO_STEPS,
    isDefault: false,
    tags: ['modern', 'experimental'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Pour Over / V60 Recipes
// ============================================

export const POUR_OVER_RECIPES: BrewRecipe[] = [
  {
    id: 'pourover-standard',
    name: 'Classic V60',
    methodId: 'pour_over',
    description: 'Standard pour over for balanced, clean cups.',
    coffeeG: 20,
    waterMl: 320,
    ratio: 16.0,
    grindSize: 40,
    temperatureC: 94,
    brewTimeSec: 180,
    steps: POUR_OVER_STEPS,
    isDefault: true,
    tags: ['balanced', 'clean'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'pourover-james-hoffmann',
    name: 'Hoffmann Method',
    methodId: 'pour_over',
    description: 'James Hoffmann\'s ultimate V60 technique.',
    coffeeG: 30,
    waterMl: 500,
    ratio: 16.7,
    grindSize: 38,
    temperatureC: 95,
    brewTimeSec: 210,
    steps: [
      {
        order: 1,
        title: 'Rinse & Bloom',
        description: 'Rinse filter, add coffee, pour 60g water.',
        durationSec: 45,
        target: { waterG: 60, tempC: 95 },
        tips: ['Swirl to saturate all grounds'],
      },
      {
        order: 2,
        title: 'First Pour',
        description: 'Pour to 300g in circles.',
        durationSec: 30,
        target: { waterG: 300 },
      },
      {
        order: 3,
        title: 'Second Pour',
        description: 'Pour to 500g.',
        durationSec: 30,
        target: { waterG: 500 },
      },
      {
        order: 4,
        title: 'Stir & Swirl',
        description: 'Stir once, swirl gently.',
        durationSec: 10,
        tips: ['Knock down grounds from walls'],
      },
      {
        order: 5,
        title: 'Drawdown',
        description: 'Wait for complete drainage.',
        durationSec: 95,
        tips: ['Should finish around 3:30'],
      },
    ],
    isDefault: false,
    tags: ['hoffmann', 'competition'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'v60-standard',
    name: 'V60 Standard',
    methodId: 'v60',
    description: 'Classic V60 pour over technique.',
    coffeeG: 20,
    waterMl: 320,
    ratio: 16.0,
    grindSize: 40,
    temperatureC: 94,
    brewTimeSec: 180,
    steps: POUR_OVER_STEPS,
    isDefault: true,
    tags: ['balanced'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Chemex Recipes
// ============================================

export const CHEMEX_RECIPES: BrewRecipe[] = [
  {
    id: 'chemex-standard',
    name: 'Classic Chemex',
    methodId: 'chemex',
    description: 'Clean, sweet coffee with the iconic Chemex.',
    coffeeG: 30,
    waterMl: 500,
    ratio: 16.7,
    grindSize: 45,
    temperatureC: 94,
    brewTimeSec: 270,
    steps: CHEMEX_STEPS,
    isDefault: true,
    tags: ['clean', 'sweet'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'chemex-large',
    name: 'Chemex for Two',
    methodId: 'chemex',
    description: 'Larger batch for sharing.',
    coffeeG: 50,
    waterMl: 800,
    ratio: 16.0,
    grindSize: 48,
    temperatureC: 94,
    brewTimeSec: 330,
    steps: CHEMEX_STEPS,
    isDefault: false,
    tags: ['batch', 'sharing'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Filter Coffee Recipes
// ============================================

export const FILTER_COFFEE_RECIPES: BrewRecipe[] = [
  {
    id: 'filter-standard',
    name: 'Standard Filter',
    methodId: 'filter_coffee',
    description: 'Reliable flat-bottom filter brew.',
    coffeeG: 20,
    waterMl: 320,
    ratio: 16.0,
    grindSize: 45,
    temperatureC: 94,
    brewTimeSec: 210,
    steps: FILTER_COFFEE_STEPS,
    isDefault: true,
    tags: ['balanced'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Turkish Coffee Recipes
// ============================================

export const TURKISH_RECIPES: BrewRecipe[] = [
  {
    id: 'turkish-traditional',
    name: 'Traditional Turkish',
    methodId: 'turkish',
    description: 'Classic Turkish coffee preparation.',
    coffeeG: 7,
    waterMl: 70,
    ratio: 10.0,
    grindSize: 100, // Extra fine
    temperatureC: 70,
    brewTimeSec: 180,
    steps: TURKISH_COFFEE_STEPS,
    isDefault: true,
    tags: ['traditional'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'turkish-sweet',
    name: 'Sweet Turkish',
    methodId: 'turkish',
    description: 'With sugar (şekerli).',
    coffeeG: 7,
    waterMl: 70,
    ratio: 10.0,
    grindSize: 100,
    temperatureC: 70,
    brewTimeSec: 180,
    steps: [
      {
        order: 1,
        title: 'Add Water & Sugar',
        description: 'Add cold water and 1 tsp sugar to cezve.',
        tips: ['Adjust sugar to taste'],
      },
      {
        order: 2,
        title: 'Add Coffee',
        description: 'Add extra-fine coffee, stir once.',
        tips: ['7g per cup'],
      },
      {
        order: 3,
        title: 'Heat Slowly',
        description: 'Heat on low without stirring.',
        durationSec: 120,
        tips: ['Watch for foam to rise'],
      },
      {
        order: 4,
        title: 'Serve',
        description: 'Pour as foam rises, before boiling.',
      },
    ],
    isDefault: false,
    tags: ['sweet'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Drip Coffee Recipes
// ============================================

export const DRIP_RECIPES: BrewRecipe[] = [
  {
    id: 'drip-standard',
    name: 'Standard Drip',
    methodId: 'drip',
    description: 'Classic automatic drip coffee.',
    coffeeG: 60,
    waterMl: 1000,
    ratio: 16.7,
    grindSize: 45,
    temperatureC: 94,
    brewTimeSec: 300,
    steps: DRIP_COFFEE_STEPS,
    isDefault: true,
    tags: ['convenient'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// AeroPress Recipes
// ============================================

export const AEROPRESS_RECIPES: BrewRecipe[] = [
  {
    id: 'aeropress-standard',
    name: 'Standard AeroPress',
    methodId: 'aeropress',
    description: 'Quick, clean cup with standard method.',
    coffeeG: 15,
    waterMl: 200,
    ratio: 13.3,
    grindSize: 40,
    temperatureC: 85,
    brewTimeSec: 90,
    steps: AEROPRESS_STEPS,
    isDefault: true,
    tags: ['quick', 'clean'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'aeropress-inverted',
    name: 'Inverted Method',
    methodId: 'aeropress',
    description: 'Inverted brewing for full immersion.',
    coffeeG: 17,
    waterMl: 220,
    ratio: 12.9,
    grindSize: 42,
    temperatureC: 88,
    brewTimeSec: 120,
    steps: [
      {
        order: 1,
        title: 'Invert',
        description: 'Place AeroPress upside down, plunger in.',
      },
      {
        order: 2,
        title: 'Add Coffee',
        description: 'Add medium-fine ground coffee.',
        tips: ['17g for a stronger cup'],
      },
      {
        order: 3,
        title: 'Add Water',
        description: 'Pour water and stir.',
        durationSec: 10,
        target: { waterG: 220, tempC: 88 },
      },
      {
        order: 4,
        title: 'Steep',
        description: 'Wait for full extraction.',
        durationSec: 90,
      },
      {
        order: 5,
        title: 'Flip & Press',
        description: 'Attach filter cap, flip, and press.',
        durationSec: 30,
        tips: ['Press slowly and steadily'],
      },
    ],
    isDefault: false,
    tags: ['inverted', 'immersion'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// French Press Recipes
// ============================================

export const FRENCH_PRESS_RECIPES: BrewRecipe[] = [
  {
    id: 'frenchpress-standard',
    name: 'Classic French Press',
    methodId: 'french_press',
    description: 'Full-bodied, rich coffee.',
    coffeeG: 30,
    waterMl: 500,
    ratio: 16.7,
    grindSize: 30,
    temperatureC: 94,
    brewTimeSec: 240,
    steps: FRENCH_PRESS_STEPS,
    isDefault: true,
    tags: ['rich', 'full-bodied'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'frenchpress-hoffmann',
    name: 'Hoffmann French Press',
    methodId: 'french_press',
    description: 'James Hoffmann\'s cleaner technique.',
    coffeeG: 30,
    waterMl: 500,
    ratio: 16.7,
    grindSize: 35,
    temperatureC: 94,
    brewTimeSec: 540,
    steps: [
      {
        order: 1,
        title: 'Add Coffee & Water',
        description: 'Add coffee, pour all water.',
        target: { waterG: 500, tempC: 94 },
      },
      {
        order: 2,
        title: 'Wait',
        description: 'Let steep without plunger.',
        durationSec: 240,
        tips: ['Don\'t touch it!'],
      },
      {
        order: 3,
        title: 'Break Crust',
        description: 'Stir crust and scoop foam.',
        durationSec: 30,
        tips: ['Remove floating grounds with spoons'],
      },
      {
        order: 4,
        title: 'Wait Again',
        description: 'Let grounds settle.',
        durationSec: 300,
        tips: ['5-8 more minutes for cleaner cup'],
      },
      {
        order: 5,
        title: 'Plunge & Pour',
        description: 'Plunge just below surface, pour gently.',
        tips: ['Don\'t press to bottom'],
      },
    ],
    isDefault: false,
    tags: ['hoffmann', 'clean'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Indian Filter Coffee Recipes
// ============================================

export const INDIAN_FILTER_RECIPES: BrewRecipe[] = [
  {
    id: 'indian-filter-traditional',
    name: 'Traditional Filter Kaapi',
    methodId: 'indian_filter',
    description: 'Classic South Indian filter coffee with chicory blend.',
    coffeeG: 20,
    waterMl: 120,
    ratio: 6.0,
    grindSize: 65, // Fine but coarser than espresso
    temperatureC: 96,
    brewTimeSec: 900, // 15 minutes
    steps: INDIAN_FILTER_STEPS,
    isDefault: true,
    tags: ['traditional', 'chicory', 'strong'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'indian-filter-degree',
    name: 'Degree Coffee',
    methodId: 'indian_filter',
    description: 'Premium 100% Arabica without chicory for cleaner taste.',
    coffeeG: 20,
    waterMl: 140,
    ratio: 7.0,
    grindSize: 60,
    temperatureC: 96,
    brewTimeSec: 720, // 12 minutes
    steps: INDIAN_FILTER_STEPS,
    isDefault: false,
    tags: ['premium', 'arabica', 'clean'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'indian-filter-strong',
    name: 'Extra Strong Decoction',
    methodId: 'indian_filter',
    description: 'Concentrated brew for those who like it bold.',
    coffeeG: 25,
    waterMl: 120,
    ratio: 5.0,
    grindSize: 70,
    temperatureC: 98,
    brewTimeSec: 1200, // 20 minutes
    steps: [
      {
        order: 1,
        title: 'Add Coffee',
        description: 'Add extra-fine ground coffee to upper chamber.',
        tips: ['Use 25g for stronger decoction', 'Add 20-30% chicory for bold flavor'],
      },
      {
        order: 2,
        title: 'Tamp Firmly',
        description: 'Press the disc down with slightly more pressure.',
        tips: ['Firmer tamp = slower drip = stronger extraction'],
      },
      {
        order: 3,
        title: 'Add Hot Water',
        description: 'Pour water just off the boil.',
        target: { waterG: 120, tempC: 98 },
      },
      {
        order: 4,
        title: 'Extended Brew',
        description: 'Allow full 20 minutes for maximum extraction.',
        durationSec: 1200,
        tips: ['Slower is stronger', 'Be patient!'],
      },
      {
        order: 5,
        title: 'Collect & Serve',
        description: 'Mix with hot milk at 1:2 ratio.',
        tips: ['This decoction is very strong - adjust milk to taste'],
      },
    ],
    isDefault: false,
    tags: ['strong', 'bold', 'concentrated'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'indian-filter-black',
    name: 'Black Filter Coffee',
    methodId: 'indian_filter',
    description: 'Decoction diluted with hot water instead of milk.',
    coffeeG: 15,
    waterMl: 100,
    ratio: 6.7,
    grindSize: 60,
    temperatureC: 96,
    brewTimeSec: 600, // 10 minutes
    steps: [
      {
        order: 1,
        title: 'Add Coffee',
        description: 'Use 100% Arabica, no chicory.',
        tips: ['Chicory is better with milk'],
      },
      {
        order: 2,
        title: 'Light Tamp',
        description: 'Place disc without pressing hard.',
      },
      {
        order: 3,
        title: 'Add Hot Water',
        description: 'Pour hot water over disc.',
        target: { waterG: 100, tempC: 96 },
      },
      {
        order: 4,
        title: 'Brew',
        description: 'Wait for decoction to collect.',
        durationSec: 600,
      },
      {
        order: 5,
        title: 'Dilute & Serve',
        description: 'Add hot water to decoction (1:1 or to taste).',
        tips: ['No milk - enjoy the pure coffee flavor'],
      },
    ],
    isDefault: false,
    tags: ['black', 'no-milk', 'pure'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// Cold Brew Recipes
// ============================================

export const COLD_BREW_RECIPES: BrewRecipe[] = [
  {
    id: 'cold-brew-concentrate',
    name: 'Classic Concentrate',
    methodId: 'cold_brew',
    description: 'Strong concentrate to dilute with water or milk. Smooth and chocolatey.',
    coffeeG: 100,
    waterMl: 600,
    ratio: 6.0,
    grindSize: 15, // Extra coarse
    temperatureC: 20,
    brewTimeSec: 64800, // 18 hours
    steps: COLD_BREW_STEPS,
    isDefault: true,
    tags: ['concentrate', 'smooth', 'versatile'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cold-brew-rtd',
    name: 'Ready-to-Drink',
    methodId: 'cold_brew',
    description: 'Lighter brew ready to drink without dilution.',
    coffeeG: 80,
    waterMl: 1000,
    ratio: 12.5,
    grindSize: 15,
    temperatureC: 20,
    brewTimeSec: 57600, // 16 hours
    steps: [
      {
        order: 1,
        title: 'Grind Coffee',
        description: 'Grind coffee extra coarse.',
        tips: ['Slightly finer than concentrate for balanced extraction'],
      },
      {
        order: 2,
        title: 'Combine',
        description: 'Add coffee and room-temperature water.',
        target: { waterG: 1000 },
      },
      {
        order: 3,
        title: 'Stir',
        description: 'Ensure all grounds are saturated.',
      },
      {
        order: 4,
        title: 'Steep',
        description: 'Refrigerate for 16 hours.',
        durationSec: 57600,
        tips: ['Fridge brewing = cleaner, brighter flavor'],
      },
      {
        order: 5,
        title: 'Filter & Serve',
        description: 'Filter and serve over ice.',
        tips: ['No dilution needed - ready to drink!'],
      },
    ],
    isDefault: false,
    tags: ['ready-to-drink', 'refreshing', 'light'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cold-brew-strong',
    name: 'Extra Strong',
    methodId: 'cold_brew',
    description: 'Bold, intense concentrate for coffee lovers.',
    coffeeG: 120,
    waterMl: 500,
    ratio: 4.2,
    grindSize: 18,
    temperatureC: 20,
    brewTimeSec: 86400, // 24 hours
    steps: [
      {
        order: 1,
        title: 'Grind Coffee',
        description: 'Grind 120g coffee extra coarse.',
      },
      {
        order: 2,
        title: 'Combine',
        description: 'Add coffee and 500ml water.',
        target: { waterG: 500 },
      },
      {
        order: 3,
        title: 'Stir Well',
        description: 'Ensure complete saturation.',
      },
      {
        order: 4,
        title: 'Long Steep',
        description: 'Steep for full 24 hours.',
        durationSec: 86400,
        tips: ['Maximum extraction time for boldest flavor'],
      },
      {
        order: 5,
        title: 'Filter',
        description: 'Double filter for clarity.',
      },
      {
        order: 6,
        title: 'Dilute & Serve',
        description: 'Dilute 1:2 or 1:3 - this is very strong!',
        tips: ['Start with more water, adjust to taste'],
      },
    ],
    isDefault: false,
    tags: ['strong', 'bold', 'intense'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'cold-brew-overnight',
    name: 'Quick Overnight',
    methodId: 'cold_brew',
    description: 'Faster 12-hour brew for next-day coffee.',
    coffeeG: 100,
    waterMl: 700,
    ratio: 7.0,
    grindSize: 12, // Slightly finer for faster extraction
    temperatureC: 20,
    brewTimeSec: 43200, // 12 hours
    steps: [
      {
        order: 1,
        title: 'Grind Coffee',
        description: 'Grind slightly finer than usual cold brew.',
        tips: ['Finer grind = faster extraction'],
      },
      {
        order: 2,
        title: 'Combine',
        description: 'Mix coffee and water before bed.',
        target: { waterG: 700 },
      },
      {
        order: 3,
        title: 'Stir',
        description: 'Stir thoroughly.',
      },
      {
        order: 4,
        title: 'Overnight Steep',
        description: 'Leave at room temp or fridge overnight.',
        durationSec: 43200,
        tips: ['Perfect for making before bed'],
      },
      {
        order: 5,
        title: 'Morning Filter',
        description: 'Filter and enjoy with breakfast.',
        tips: ['Dilute 1:1 for balanced strength'],
      },
    ],
    isDefault: false,
    tags: ['quick', 'overnight', 'convenient'],
    createdAt: now,
    updatedAt: now,
  },
];

// ============================================
// All Recipes Registry
// ============================================

export const ALL_BREW_RECIPES: BrewRecipe[] = [
  ...ESPRESSO_RECIPES,
  ...POUR_OVER_RECIPES,
  ...CHEMEX_RECIPES,
  ...FILTER_COFFEE_RECIPES,
  ...TURKISH_RECIPES,
  ...DRIP_RECIPES,
  ...AEROPRESS_RECIPES,
  ...FRENCH_PRESS_RECIPES,
  ...INDIAN_FILTER_RECIPES,
  ...COLD_BREW_RECIPES,
];

// Get recipes by method
export function getRecipesByMethod(methodId: BrewMethodId): BrewRecipe[] {
  return ALL_BREW_RECIPES.filter(r => r.methodId === methodId);
}

// Get default recipe for a method
export function getDefaultRecipe(methodId: BrewMethodId): BrewRecipe | undefined {
  return ALL_BREW_RECIPES.find(r => r.methodId === methodId && r.isDefault);
}

// Get recipe by ID
export function getRecipeById(id: string): BrewRecipe | undefined {
  return ALL_BREW_RECIPES.find(r => r.id === id);
}

