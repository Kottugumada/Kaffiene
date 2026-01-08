// Domain Models

export type RoastLevel = 'light' | 'medium' | 'dark' | 'espresso';
export type BrewMethodId = 'espresso' | 'filter_coffee' | 'turkish' | 'pour_over' | 'chemex' | 'v60' | 'drip' | 'aeropress' | 'french_press';
/** @deprecated Use BrewMethodId instead */
export type BrewMethod = BrewMethodId;
export type UIMode = 'beginner' | 'enthusiast';
export type Theme = 'light' | 'dark' | 'auto';
export type CoffeeWeightUnit = 'grams' | 'ounces';
export type LiquidVolumeUnit = 'ounces' | 'milliliters';
export type TemperatureUnit = 'celsius' | 'fahrenheit';

// ============================================
// Brew Method & Recipe Types (V2)
// ============================================

export type BrewMethodCategory = 'espresso' | 'pour_over' | 'immersion' | 'drip' | 'stovetop';

export interface BrewStep {
  order: number;
  title: string;
  description: string;
  durationSec?: number;
  target?: {
    waterG?: number;
    tempC?: number;
  };
  tips?: string[];
}

export interface BrewMethodInfo {
  id: BrewMethodId;
  name: string;
  category: BrewMethodCategory;
  icon: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  brewTimeRange: { min: number; max: number }; // seconds
  defaultRatio: number;
  grindSize: 'extra_fine' | 'fine' | 'medium_fine' | 'medium' | 'medium_coarse' | 'coarse';
  temperatureRange: { min: number; max: number }; // celsius
  equipment: string[];
  heroImage?: string;
  gradient: readonly [string, string, ...string[]];
  accentColor: string;
}

export interface BrewRecipe {
  id: string;
  name: string;
  methodId: BrewMethodId;
  description: string;
  coffeeG: number;
  waterMl: number;
  ratio: number;
  grindSize: number; // 0-100 scale
  temperatureC: number;
  brewTimeSec: number;
  steps: BrewStep[];
  isDefault: boolean;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Bean {
  id: string;
  name: string;
  roastLevel: RoastLevel;
  origin?: string;
  processingMethod?: string;
  notes?: string;
  isSeedData: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface StructuredTaste {
  acidity?: number; // 1-5
  body?: number; // 1-5
  sweetness?: number; // 1-5
  bitterness?: number; // 1-5
}

export interface EspressoParameters {
  dose: number; // grams (stored internally)
  yield: number; // ml (stored internally)
  time: number; // seconds
  grind: number; // 0-100 scale or equipment-specific
  temperature: number; // celsius (stored internally)
  pressure?: number; // bar
  preInfusionTime?: number; // seconds
  ratio: number; // calculated: yield/dose
  tds?: number; // total dissolved solids %
  extraction?: number; // extraction %
}

export interface PourOverParameters {
  coffee: number; // grams
  water: number; // ml
  grind: number;
  temperature: number; // celsius
  bloomTime?: number; // seconds
  totalTime: number; // seconds
  pourStages?: Array<{ time: number; water: number }>;
  ratio: number;
}

export interface FilterCoffeeParameters {
  coffee: number; // grams
  water: number; // ml
  grind: number;
  temperature: number; // celsius
  brewTime: number; // seconds
  ratio: number;
}

export interface TurkishCoffeeParameters {
  coffee: number; // grams
  water: number; // ml
  sugar: number; // 0-4 scale
  temperature: number; // celsius
  brewTime: number; // seconds
}

export type BrewParameters = 
  | EspressoParameters
  | PourOverParameters
  | FilterCoffeeParameters
  | TurkishCoffeeParameters;

export interface Recipe {
  id: string;
  name: string;
  brewMethod: BrewMethod;
  beanId?: string;
  parameters: BrewParameters;
  notes?: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BrewLog {
  id: string;
  beanId: string;
  brewMethod: BrewMethod;
  recipeId?: string;
  timestamp: number;
  parameters: BrewParameters;
  rating?: number; // 1-5
  tasteNotes?: string;
  structuredTaste?: StructuredTaste;
  equipment?: string;
  notes?: string;
  troubleshootingSessionId?: string;
  images?: string[]; // Array of local file URIs
}

export interface UserPreferences {
  userId: string;
  coffeeWeightUnit: CoffeeWeightUnit;
  liquidVolumeUnit: LiquidVolumeUnit;
  temperatureUnit: TemperatureUnit;
  defaultBrewMethod: BrewMethod;
  uiMode: UIMode;
  theme: Theme;
  updatedAt: number;
}

export interface TroubleshootingAnswer {
  taste?: 'sour' | 'bitter' | 'balanced' | 'weak' | 'too_strong';
  flow?: 'too_fast' | 'too_slow' | 'just_right' | 'channeling';
  timing?: number; // seconds, or null if skipped
  puck?: 'wet' | 'dry' | 'perfect' | 'channeling' | null;
}

export interface Adjustment {
  type: 'grind' | 'ratio' | 'dose' | 'temperature' | 'distribution';
  direction: 'finer' | 'coarser' | 'increase' | 'decrease' | 'longer' | 'shorter' | 'maintain' | 'improve';
  magnitude: 'slight' | 'moderate' | 'significant';
  reason: string;
}

export interface TroubleshootingDiagnosis {
  primaryAdjustment: Adjustment;
  secondaryAdjustment?: Adjustment;
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface TroubleshootingSession {
  id: string;
  shotLogId?: string;
  timestamp: number;
  answers: TroubleshootingAnswer;
  diagnosis: TroubleshootingDiagnosis;
  applied: boolean;
  outcome?: 'improved' | 'same' | 'worse';
}

