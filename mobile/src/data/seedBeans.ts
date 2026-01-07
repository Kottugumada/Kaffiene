// Seed Beans Data - Expanded with popular, recognizable beans
import { Bean } from '../types';

export const SEED_BEANS: Omit<Bean, 'id' | 'createdAt' | 'updatedAt' | 'isSeedData'>[] = [
  // === Ethiopia ===
  {
    name: 'Ethiopian Yirgacheffe',
    roastLevel: 'light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    notes: 'Floral, citrus, bergamot, bright acidity.',
  },
  {
    name: 'Ethiopian Sidamo',
    roastLevel: 'light',
    origin: 'Ethiopia',
    processingMethod: 'Natural',
    notes: 'Berry, wine-like, sweet, complex.',
  },
  {
    name: 'Ethiopian Guji',
    roastLevel: 'light',
    origin: 'Ethiopia',
    processingMethod: 'Natural',
    notes: 'Blueberry, tropical fruit, floral.',
  },

  // === Kenya ===
  {
    name: 'Kenyan AA',
    roastLevel: 'light',
    origin: 'Kenya',
    processingMethod: 'Washed',
    notes: 'Blackcurrant, winey acidity, juicy.',
  },

  // === Colombia ===
  {
    name: 'Colombian Supremo',
    roastLevel: 'medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    notes: 'Caramel, red fruit, balanced sweetness.',
  },
  {
    name: 'Colombian Excelso',
    roastLevel: 'medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    notes: 'Nutty, sweet, smooth body.',
  },
  {
    name: 'Colombian Huila',
    roastLevel: 'medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    notes: 'Stone fruit, panela sweetness, balanced acidity.',
  },

  // === Brazil ===
  {
    name: 'Brazilian Santos',
    roastLevel: 'medium',
    origin: 'Brazil',
    processingMethod: 'Natural',
    notes: 'Chocolate, nutty, low acidity.',
  },
  {
    name: 'Brazilian Cerrado',
    roastLevel: 'medium',
    origin: 'Brazil',
    processingMethod: 'Natural',
    notes: 'Full body, cocoa, smooth finish.',
  },

  // === Central America ===
  {
    name: 'Guatemalan Antigua',
    roastLevel: 'medium',
    origin: 'Guatemala',
    processingMethod: 'Washed',
    notes: 'Cocoa, spice, balanced acidity.',
  },
  {
    name: 'Costa Rican Tarrazú',
    roastLevel: 'medium',
    origin: 'Costa Rica',
    processingMethod: 'Washed',
    notes: 'Bright acidity, citrus, clean sweetness.',
  },
  {
    name: 'Honduran Marcala',
    roastLevel: 'medium',
    origin: 'Honduras',
    processingMethod: 'Washed',
    notes: 'Caramel, apple, mild acidity.',
  },
  {
    name: 'Nicaraguan Jinotega',
    roastLevel: 'medium',
    origin: 'Nicaragua',
    processingMethod: 'Washed',
    notes: 'Chocolate, almond, balanced body.',
  },

  // === Indonesia ===
  {
    name: 'Sumatran Mandheling',
    roastLevel: 'dark',
    origin: 'Sumatra',
    processingMethod: 'Wet-hulled',
    notes: 'Earthy, herbal, heavy body.',
  },
  {
    name: 'Sulawesi Toraja',
    roastLevel: 'dark',
    origin: 'Indonesia',
    processingMethod: 'Wet-hulled',
    notes: 'Spicy, earthy, syrupy body.',
  },

  // === Espresso / Blends ===
  {
    name: 'Italian Espresso Blend',
    roastLevel: 'espresso',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Traditional espresso, balanced bitterness.',
  },
  {
    name: 'Modern Espresso Blend',
    roastLevel: 'medium',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Chocolate, red fruit, versatile.',
  },
  {
    name: 'House Espresso Blend',
    roastLevel: 'espresso',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Chocolate, caramel, crowd-pleaser.',
  },
  {
    name: 'Arabica + Robusta Espresso Blend',
    roastLevel: 'dark',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Thick crema, bold body, higher caffeine.',
  },
];

