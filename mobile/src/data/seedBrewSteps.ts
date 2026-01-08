// Seed Data: Brew Steps
// Step-by-step brewing instructions for guided flows

import { BrewStep, BrewMethodId } from '../types';

// ============================================
// Espresso Steps
// ============================================

export const ESPRESSO_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Preheat',
    description: 'Preheat portafilter and cup with hot water.',
    durationSec: 10,
    tips: ['Stability improves extraction consistency'],
  },
  {
    order: 2,
    title: 'Grind & Dose',
    description: 'Grind coffee finely and dose into portafilter.',
    tips: ['Target 18g for a double shot'],
  },
  {
    order: 3,
    title: 'Distribute & Tamp',
    description: 'Evenly distribute grounds and tamp firmly.',
    tips: ['Level puck prevents channeling'],
  },
  {
    order: 4,
    title: 'Extract',
    description: 'Pull shot to target yield.',
    durationSec: 27,
    target: { waterG: 36 },
    tips: ['Flow should resemble warm honey'],
  },
];

// ============================================
// Pour Over / V60 Steps
// ============================================

export const POUR_OVER_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Rinse Filter',
    description: 'Rinse paper filter and preheat brewer.',
    durationSec: 10,
    tips: ['Removes paper taste and preheats vessel'],
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add medium-coarse ground coffee.',
    tips: ['20g coffee is a common starting point'],
  },
  {
    order: 3,
    title: 'Bloom',
    description: 'Pour water to saturate grounds.',
    durationSec: 40,
    target: { waterG: 40, tempC: 94 },
    tips: ['Look for bubbling - that\'s CO2 escaping'],
  },
  {
    order: 4,
    title: 'Main Pour',
    description: 'Pour slowly in concentric circles.',
    durationSec: 90,
    target: { waterG: 300 },
    tips: ['Maintain a steady flow rate'],
  },
  {
    order: 5,
    title: 'Drawdown',
    description: 'Allow water to fully drain.',
    durationSec: 60,
    tips: ['Total brew time ~3 minutes'],
  },
];

// ============================================
// Chemex Steps
// ============================================

export const CHEMEX_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Rinse Filter',
    description: 'Rinse thick Chemex filter thoroughly.',
    durationSec: 15,
    tips: ['Chemex filters are thicker - rinse well'],
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add medium-coarse ground coffee.',
    tips: ['30g for a 500ml brew'],
  },
  {
    order: 3,
    title: 'Bloom',
    description: 'Pour twice the coffee weight in water.',
    durationSec: 45,
    target: { waterG: 60, tempC: 94 },
    tips: ['Gently stir to ensure even saturation'],
  },
  {
    order: 4,
    title: 'First Pour',
    description: 'Pour in slow spirals to 200g.',
    durationSec: 60,
    target: { waterG: 200 },
  },
  {
    order: 5,
    title: 'Second Pour',
    description: 'Continue pouring to final weight.',
    durationSec: 60,
    target: { waterG: 500 },
  },
  {
    order: 6,
    title: 'Drawdown',
    description: 'Allow complete drainage.',
    durationSec: 90,
    tips: ['Total time should be 4-5 minutes'],
  },
];

// ============================================
// Filter Coffee Steps
// ============================================

export const FILTER_COFFEE_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Rinse & Preheat',
    description: 'Rinse filter and preheat brewer.',
    durationSec: 10,
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add medium-ground coffee.',
    tips: ['Use a 1:16 coffee-to-water ratio'],
  },
  {
    order: 3,
    title: 'Bloom',
    description: 'Pour just enough water to saturate grounds.',
    durationSec: 30,
    target: { waterG: 40, tempC: 94 },
  },
  {
    order: 4,
    title: 'Final Pour',
    description: 'Pour remaining water evenly.',
    durationSec: 120,
    target: { waterG: 300 },
  },
  {
    order: 5,
    title: 'Finish',
    description: 'Allow brew to complete and serve.',
    durationSec: 60,
  },
];

// ============================================
// Turkish Coffee Steps
// ============================================

export const TURKISH_COFFEE_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Add Water',
    description: 'Add cold water to cezve.',
    tips: ['70ml per cup'],
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add extra-fine coffee and sugar (optional).',
    tips: ['Do not stir after initial mix'],
  },
  {
    order: 3,
    title: 'Heat Slowly',
    description: 'Heat without boiling.',
    durationSec: 120,
    target: { tempC: 70 },
    tips: ['Foam should rise slowly'],
  },
  {
    order: 4,
    title: 'Serve',
    description: 'Pour into cup as foam rises.',
    tips: ['Do not boil - bitterness will increase'],
  },
];

// ============================================
// Drip Coffee Steps
// ============================================

export const DRIP_COFFEE_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Prepare Filter',
    description: 'Insert filter and rinse if needed.',
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add medium-ground coffee to basket.',
    tips: ['60g per liter of water'],
  },
  {
    order: 3,
    title: 'Add Water',
    description: 'Fill reservoir with filtered water.',
  },
  {
    order: 4,
    title: 'Brew',
    description: 'Start machine and wait.',
    durationSec: 300,
    tips: ['Ideal brew time is 4-6 minutes'],
  },
  {
    order: 5,
    title: 'Serve',
    description: 'Serve immediately for best flavor.',
  },
];

// ============================================
// AeroPress Steps (Standard Method)
// ============================================

export const AEROPRESS_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Prepare',
    description: 'Insert filter and rinse. Place on cup.',
    durationSec: 10,
    tips: ['Preheat AeroPress with hot water'],
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add medium-fine ground coffee.',
    tips: ['15g for a single cup'],
  },
  {
    order: 3,
    title: 'Add Water',
    description: 'Pour water and stir briefly.',
    durationSec: 10,
    target: { waterG: 200, tempC: 85 },
    tips: ['Lower temp for lighter roasts'],
  },
  {
    order: 4,
    title: 'Steep',
    description: 'Wait for extraction.',
    durationSec: 60,
  },
  {
    order: 5,
    title: 'Press',
    description: 'Press slowly and steadily.',
    durationSec: 30,
    tips: ['Stop when you hear a hiss'],
  },
];

// ============================================
// French Press Steps
// ============================================

export const FRENCH_PRESS_STEPS: BrewStep[] = [
  {
    order: 1,
    title: 'Preheat',
    description: 'Preheat French Press with hot water.',
    durationSec: 10,
  },
  {
    order: 2,
    title: 'Add Coffee',
    description: 'Add coarse-ground coffee.',
    tips: ['30g for 500ml water'],
  },
  {
    order: 3,
    title: 'Add Water',
    description: 'Pour all water and start timer.',
    target: { waterG: 500, tempC: 94 },
  },
  {
    order: 4,
    title: 'Steep',
    description: 'Let coffee steep with lid on.',
    durationSec: 240,
    tips: ['4 minutes is the sweet spot'],
  },
  {
    order: 5,
    title: 'Plunge',
    description: 'Press plunger slowly and steadily.',
    durationSec: 20,
    tips: ['Don\'t press too hard'],
  },
  {
    order: 6,
    title: 'Serve',
    description: 'Pour immediately to stop extraction.',
    tips: ['Decant fully to prevent over-extraction'],
  },
];

// ============================================
// Steps Registry
// ============================================

export const BREW_STEPS_BY_METHOD: Record<BrewMethodId, BrewStep[]> = {
  espresso: ESPRESSO_STEPS,
  pour_over: POUR_OVER_STEPS,
  v60: POUR_OVER_STEPS, // V60 uses same steps as pour over
  chemex: CHEMEX_STEPS,
  filter_coffee: FILTER_COFFEE_STEPS,
  turkish: TURKISH_COFFEE_STEPS,
  drip: DRIP_COFFEE_STEPS,
  aeropress: AEROPRESS_STEPS,
  french_press: FRENCH_PRESS_STEPS,
};

// Get steps for a brew method
export function getBrewSteps(methodId: BrewMethodId): BrewStep[] {
  return BREW_STEPS_BY_METHOD[methodId] || [];
}

// Calculate total brew time from steps
export function calculateTotalBrewTime(steps: BrewStep[]): number {
  return steps.reduce((total, step) => total + (step.durationSec || 0), 0);
}

