// Seed Data - Machine-readable, expandable, useful for recommendations + education

export interface OriginRecipe {
  origin: string;
  dose_g: number | { min: number; max: number };
  ratio: string | { min: string; max: string };
  yield_g: number | { min: number; max: number };
  time_sec: number | { min: number; max: number };
  temp_c: number | { min: number; max: number };
  pressure_bar?: number;
  flavor_notes: string[];
}

export interface RoastLevelRecipe {
  roast: 'light' | 'medium' | 'dark' | 'espresso';
  dose_g: number | { min: number; max: number };
  ratio: string | { min: string; max: string };
  yield_g: number | { min: number; max: number };
  time_sec: number | { min: number; max: number };
  temp_c: number | { min: number; max: number };
  pressure_bar: number;
  flavor_focus: string[];
}

export interface BeanTypeInfo {
  bean_type: 'arabica' | 'arabica_robusta_blend';
  recommended_ratio: string;
  crema: string;
  acidity?: string;
  sweetness?: string;
  body?: string;
  caffeine?: string;
}

// Origin-based espresso starting points
export const ORIGIN_RECIPES: Record<string, OriginRecipe> = {
  ethiopia: {
    origin: 'Ethiopia',
    dose_g: 18,
    ratio: '1:2.2 – 1:2.5',
    yield_g: { min: 40, max: 45 },
    time_sec: { min: 28, max: 35 },
    temp_c: { min: 94, max: 96 },
    flavor_notes: ['floral', 'citrus', 'berry'],
  },
  kenya: {
    origin: 'Kenya',
    dose_g: { min: 18, max: 19 },
    ratio: '1:2.2',
    yield_g: { min: 40, max: 42 },
    time_sec: { min: 28, max: 32 },
    temp_c: { min: 94, max: 96 },
    flavor_notes: ['blackcurrant', 'bright acidity'],
  },
  colombia: {
    origin: 'Colombia',
    dose_g: { min: 18, max: 20 },
    ratio: '1:2',
    yield_g: { min: 36, max: 40 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 92, max: 94 },
    flavor_notes: ['caramel', 'red fruit', 'balanced'],
  },
  brazil: {
    origin: 'Brazil',
    dose_g: { min: 18, max: 20 },
    ratio: '1:1.8 – 1:2',
    yield_g: { min: 32, max: 40 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 91, max: 93 },
    flavor_notes: ['chocolate', 'nutty', 'low acidity'],
  },
  guatemala: {
    origin: 'Guatemala',
    dose_g: { min: 18, max: 20 },
    ratio: '1:2',
    yield_g: { min: 36, max: 40 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 92, max: 94 },
    flavor_notes: ['cocoa', 'spice', 'balanced acidity'],
  },
  sumatra: {
    origin: 'Sumatra',
    dose_g: { min: 18, max: 20 },
    ratio: '1:1.7 – 1:2',
    yield_g: { min: 30, max: 36 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 91, max: 93 },
    flavor_notes: ['earthy', 'herbal', 'heavy body'],
  },
};

// Roast-level recommended espresso recipes
export const ROAST_RECIPES: Record<string, RoastLevelRecipe> = {
  light: {
    roast: 'light',
    dose_g: { min: 18, max: 20 },
    ratio: '1:2.2 – 1:2.5',
    yield_g: { min: 40, max: 50 },
    time_sec: { min: 28, max: 35 },
    temp_c: { min: 94, max: 96 },
    pressure_bar: 9,
    flavor_focus: ['acidity', 'clarity', 'origin character'],
  },
  medium: {
    roast: 'medium',
    dose_g: { min: 18, max: 20 },
    ratio: '1:2',
    yield_g: { min: 36, max: 40 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 92, max: 94 },
    pressure_bar: 9,
    flavor_focus: ['balance', 'sweetness', 'body'],
  },
  dark: {
    roast: 'dark',
    dose_g: { min: 18, max: 20 },
    ratio: '1:1.5 – 1:1.8',
    yield_g: { min: 27, max: 36 },
    time_sec: { min: 22, max: 28 },
    temp_c: { min: 90, max: 92 },
    pressure_bar: 9,
    flavor_focus: ['body', 'chocolate', 'low acidity'],
  },
  espresso: {
    roast: 'espresso',
    dose_g: { min: 18, max: 20 },
    ratio: '1:2',
    yield_g: { min: 36, max: 40 },
    time_sec: { min: 25, max: 30 },
    temp_c: { min: 92, max: 94 },
    pressure_bar: 9,
    flavor_focus: ['balance', 'sweetness', 'body'],
  },
};

// Default universal starting espresso recipe
export const DEFAULT_ESPRESSO = {
  dose_g: 18,
  yield_g: 36,
  ratio: '1:2',
  time_sec: 27,
  temp_c: 93,
  pressure_bar: 9,
};

// Shot type definitions
export const SHOT_TYPES = {
  single: {
    dose_g: { min: 8, max: 11 },
    yield_g: { min: 16, max: 22 },
    ratio: '1:2',
    time_sec: { min: 25, max: 30 },
  },
  double: {
    dose_g: { min: 18, max: 20 },
    yield_g: { min: 36, max: 42 },
    ratio: '1:2',
    time_sec: { min: 25, max: 30 },
  },
};

// Bean type information
export const BEAN_TYPES: Record<string, BeanTypeInfo> = {
  arabica: {
    bean_type: 'arabica',
    recommended_ratio: '1:2 – 1:2.5',
    crema: 'moderate',
    acidity: 'medium-high',
    sweetness: 'high',
  },
  arabica_robusta_blend: {
    bean_type: 'arabica_robusta_blend',
    recommended_ratio: '1:1.5 – 1:2',
    crema: 'high',
    body: 'heavy',
    caffeine: 'higher',
  },
};

// Helper functions to extract values from ranges
export function getAverageValue(value: number | { min: number; max: number }): number {
  if (typeof value === 'number') return value;
  return (value.min + value.max) / 2;
}

export function getRatioValue(ratio: string | { min: string; max: string }): number {
  if (typeof ratio === 'string') {
    // Extract number from "1:2" or "1:2.2 – 1:2.5"
    const match = ratio.match(/1:([\d.]+)/);
    return match ? parseFloat(match[1]) : 2.0;
  }
  // For range, take the first value
  const match = ratio.min.match(/1:([\d.]+)/);
  return match ? parseFloat(match[1]) : 2.0;
}

