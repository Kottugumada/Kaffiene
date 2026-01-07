// Ratio System Types

import { BrewMethod, RoastLevel } from './domain';

export interface RatioDefinition {
  id: string;
  name: string;
  ratio: number; // e.g., 2.0 means 1:2
  brewMethod: BrewMethod;
  targetTime?: { min: number; max: number }; // seconds
  targetTemp?: { min: number; max: number }; // celsius
  targetPressure?: number; // bar
  useWhen: string;
  roastLevels?: RoastLevel[];
}

export const CANONICAL_RATIOS: RatioDefinition[] = [
  {
    id: 'espresso_ristretto',
    name: 'Ristretto',
    ratio: 1.5,
    brewMethod: 'espresso',
    targetTime: { min: 20, max: 25 },
    targetTemp: { min: 90, max: 92 },
    useWhen: 'Dark roasts, heavy body, lower bitterness',
    roastLevels: ['dark', 'espresso'],
  },
  {
    id: 'espresso_standard',
    name: 'Standard Espresso',
    ratio: 2.0,
    brewMethod: 'espresso',
    targetTime: { min: 25, max: 30 },
    targetTemp: { min: 92, max: 94 },
    targetPressure: 9,
    useWhen: 'Medium roasts, traditional espresso profile',
    roastLevels: ['medium', 'espresso'],
  },
  {
    id: 'espresso_lungo',
    name: 'Lungo',
    ratio: 2.5,
    brewMethod: 'espresso',
    targetTime: { min: 30, max: 40 },
    targetTemp: { min: 93, max: 95 },
    useWhen: 'Lighter roasts, higher clarity (but higher bitterness risk)',
    roastLevels: ['light', 'medium'],
  },
  {
    id: 'filter_standard',
    name: 'Standard Filter',
    ratio: 16.0,
    brewMethod: 'pour_over',
    targetTemp: { min: 92, max: 96 },
    useWhen: 'General pour-over, balanced extraction',
    roastLevels: ['light', 'medium', 'dark'],
  },
];

