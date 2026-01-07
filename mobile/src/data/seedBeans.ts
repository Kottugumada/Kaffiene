// Seed Beans Data - Pre-populated beans for users to browse/select
import { Bean } from '../types';

export const SEED_BEANS: Omit<Bean, 'id' | 'createdAt' | 'updatedAt' | 'isSeedData'>[] = [
  {
    name: 'Ethiopian Yirgacheffe',
    roastLevel: 'light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    notes: 'Floral, citrus, berry notes. Bright acidity.',
  },
  {
    name: 'Ethiopian Sidamo',
    roastLevel: 'light',
    origin: 'Ethiopia',
    processingMethod: 'Natural',
    notes: 'Fruity, wine-like, complex.',
  },
  {
    name: 'Kenyan AA',
    roastLevel: 'light',
    origin: 'Kenya',
    processingMethod: 'Washed',
    notes: 'Blackcurrant, bright acidity, winey.',
  },
  {
    name: 'Colombian Supremo',
    roastLevel: 'medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    notes: 'Caramel, red fruit, balanced.',
  },
  {
    name: 'Colombian Excelso',
    roastLevel: 'medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    notes: 'Sweet, nutty, well-balanced.',
  },
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
    notes: 'Smooth, chocolatey, full body.',
  },
  {
    name: 'Guatemalan Antigua',
    roastLevel: 'medium',
    origin: 'Guatemala',
    processingMethod: 'Washed',
    notes: 'Cocoa, spice, balanced acidity.',
  },
  {
    name: 'Sumatran Mandheling',
    roastLevel: 'dark',
    origin: 'Sumatra',
    processingMethod: 'Wet-hulled',
    notes: 'Earthy, herbal, heavy body.',
  },
  {
    name: 'Italian Espresso Blend',
    roastLevel: 'espresso',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Traditional espresso profile, balanced.',
  },
  {
    name: 'House Espresso Blend',
    roastLevel: 'espresso',
    origin: 'Blend',
    processingMethod: 'Blend',
    notes: 'Chocolate, caramel, versatile.',
  },
];

