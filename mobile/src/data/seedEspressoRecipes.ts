// Seed Espresso Recipes - Linked to roast/origin/processing for recommendations
export type EspressoRecipe = {
  name: string;
  appliesTo: {
    roastLevel?: string;
    origin?: string;
    processingMethod?: string;
  };
  doseG: number;
  yieldG: number;
  ratio: string;
  timeSec: string;
  tempC: number;
  notes: string;
};

export const SEED_ESPRESSO_RECIPES: EspressoRecipe[] = [
  // === Universal Defaults ===
  {
    name: 'Modern Espresso Standard',
    appliesTo: {},
    doseG: 18,
    yieldG: 36,
    ratio: '1:2',
    timeSec: '25–30',
    tempC: 93,
    notes: 'Balanced, reliable starting point.',
  },

  // === Light Roast ===
  {
    name: 'Light Roast Espresso',
    appliesTo: { roastLevel: 'light' },
    doseG: 18,
    yieldG: 42,
    ratio: '1:2.3',
    timeSec: '28–35',
    tempC: 95,
    notes: 'Enhances clarity and acidity.',
  },

  // === Medium Roast ===
  {
    name: 'Medium Roast Espresso',
    appliesTo: { roastLevel: 'medium' },
    doseG: 18,
    yieldG: 36,
    ratio: '1:2',
    timeSec: '25–30',
    tempC: 93,
    notes: 'Balanced sweetness and body.',
  },

  // === Dark Roast ===
  {
    name: 'Dark Roast Espresso',
    appliesTo: { roastLevel: 'dark' },
    doseG: 18,
    yieldG: 30,
    ratio: '1:1.7',
    timeSec: '22–28',
    tempC: 91,
    notes: 'Reduces bitterness, boosts body.',
  },

  // === Origin-Based ===
  {
    name: 'Ethiopian Espresso',
    appliesTo: { origin: 'Ethiopia' },
    doseG: 18,
    yieldG: 40,
    ratio: '1:2.2',
    timeSec: '28–32',
    tempC: 95,
    notes: 'Preserves florals and fruit.',
  },
  {
    name: 'Brazilian Espresso',
    appliesTo: { origin: 'Brazil' },
    doseG: 18,
    yieldG: 34,
    ratio: '1:1.9',
    timeSec: '25–30',
    tempC: 92,
    notes: 'Chocolate-forward, low acidity.',
  },
  {
    name: 'Kenyan Espresso',
    appliesTo: { origin: 'Kenya' },
    doseG: 18,
    yieldG: 40,
    ratio: '1:2.2',
    timeSec: '28–32',
    tempC: 95,
    notes: 'Juicy acidity, fruit-driven.',
  },
  {
    name: 'Colombian Espresso',
    appliesTo: { origin: 'Colombia' },
    doseG: 18,
    yieldG: 36,
    ratio: '1:2',
    timeSec: '25–30',
    tempC: 93,
    notes: 'Caramel, balanced sweetness.',
  },
  {
    name: 'Guatemalan Espresso',
    appliesTo: { origin: 'Guatemala' },
    doseG: 18,
    yieldG: 36,
    ratio: '1:2',
    timeSec: '25–30',
    tempC: 93,
    notes: 'Cocoa, spice, balanced.',
  },
  {
    name: 'Sumatran Espresso',
    appliesTo: { origin: 'Sumatra' },
    doseG: 18,
    yieldG: 32,
    ratio: '1:1.8',
    timeSec: '25–30',
    tempC: 91,
    notes: 'Earthy, heavy body.',
  },

  // === Processing-Based ===
  {
    name: 'Natural Process Espresso',
    appliesTo: { processingMethod: 'Natural' },
    doseG: 18,
    yieldG: 38,
    ratio: '1:2.1',
    timeSec: '26–32',
    tempC: 94,
    notes: 'Boosts sweetness and body.',
  },
  {
    name: 'Washed Process Espresso',
    appliesTo: { processingMethod: 'Washed' },
    doseG: 18,
    yieldG: 40,
    ratio: '1:2.2',
    timeSec: '28–32',
    tempC: 94,
    notes: 'Cleaner flavor separation.',
  },

  // === Traditional Italian Style ===
  {
    name: 'Italian-Style Espresso',
    appliesTo: { roastLevel: 'espresso' },
    doseG: 18,
    yieldG: 27,
    ratio: '1:1.5',
    timeSec: '22–25',
    tempC: 90,
    notes: 'Short, intense, heavy body.',
  },
];

