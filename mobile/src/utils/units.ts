// Unit Conversion Utilities
// All values stored in base units internally: grams, ml, celsius

export const CONVERSION_CONSTANTS = {
  OZ_TO_GRAMS: 28.35,
  OZ_TO_ML: 29.57,
};

export function gramsToOunces(grams: number): number {
  return grams / CONVERSION_CONSTANTS.OZ_TO_GRAMS;
}

export function ouncesToGrams(ounces: number): number {
  return ounces * CONVERSION_CONSTANTS.OZ_TO_GRAMS;
}

export function mlToOunces(ml: number): number {
  return ml / CONVERSION_CONSTANTS.OZ_TO_ML;
}

export function ouncesToMl(ounces: number): number {
  return ounces * CONVERSION_CONSTANTS.OZ_TO_ML;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

// Calculate ratio from dose and yield (unit-agnostic)
export function calculateRatio(
  coffeeAmount: number,
  coffeeUnit: 'grams' | 'ounces',
  waterAmount: number,
  waterUnit: 'ml' | 'ounces'
): number {
  // Convert to base units
  const coffeeGrams = coffeeUnit === 'ounces' ? ouncesToGrams(coffeeAmount) : coffeeAmount;
  const waterMl = waterUnit === 'ounces' ? ouncesToMl(waterAmount) : waterAmount;
  
  // Ratio is water:coffee (e.g., 2.0 means 2ml water per 1g coffee)
  return waterMl / coffeeGrams;
}

// Calculate yield from dose and ratio
export function calculateYield(dose: number, ratio: number): number {
  return dose * ratio; // Returns in same unit as dose
}

// Calculate dose from yield and ratio
export function calculateDose(yieldAmount: number, ratio: number): number {
  return yieldAmount / ratio;
}

