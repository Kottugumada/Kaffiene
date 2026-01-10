import { CoffeeWeightUnit, LiquidVolumeUnit, TemperatureUnit } from '../types';
import {
  gramsToOunces,
  ouncesToGrams,
  mlToOunces,
  ouncesToMl,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from './units';

/**
 * Format a weight value based on user preference
 * @param grams - Value in grams (internal storage)
 * @param unit - User's preferred unit
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatWeight(
  grams: number,
  unit: CoffeeWeightUnit,
  decimals: number = 1
): string {
  if (unit === 'ounces') {
    return gramsToOunces(grams).toFixed(decimals);
  }
  return grams.toFixed(decimals);
}

/**
 * Get weight unit label
 */
export function getWeightUnitLabel(unit: CoffeeWeightUnit): string {
  return unit === 'ounces' ? 'oz' : 'g';
}

/**
 * Convert user input weight to grams (for internal storage)
 */
export function parseWeight(value: string, unit: CoffeeWeightUnit): number {
  const num = parseFloat(value) || 0;
  if (unit === 'ounces') {
    return ouncesToGrams(num);
  }
  return num;
}

/**
 * Format a volume value based on user preference
 * @param ml - Value in milliliters (internal storage)
 * @param unit - User's preferred unit
 * @param decimals - Number of decimal places (default: 1)
 */
export function formatVolume(
  ml: number,
  unit: LiquidVolumeUnit,
  decimals: number = 1
): string {
  if (unit === 'ounces') {
    return mlToOunces(ml).toFixed(decimals);
  }
  return ml.toFixed(decimals);
}

/**
 * Get volume unit label
 */
export function getVolumeUnitLabel(unit: LiquidVolumeUnit): string {
  return unit === 'ounces' ? 'oz' : 'ml';
}

/**
 * Convert user input volume to ml (for internal storage)
 */
export function parseVolume(value: string, unit: LiquidVolumeUnit): number {
  const num = parseFloat(value) || 0;
  if (unit === 'ounces') {
    return ouncesToMl(num);
  }
  return num;
}

/**
 * Format a temperature value based on user preference
 * @param celsius - Value in Celsius (internal storage)
 * @param unit - User's preferred unit
 * @param decimals - Number of decimal places (default: 0)
 */
export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit,
  decimals: number = 0
): string {
  if (unit === 'fahrenheit') {
    return celsiusToFahrenheit(celsius).toFixed(decimals);
  }
  return celsius.toFixed(decimals);
}

/**
 * Get temperature unit label
 */
export function getTemperatureUnitLabel(unit: TemperatureUnit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

/**
 * Convert user input temperature to Celsius (for internal storage)
 */
export function parseTemperature(value: string, unit: TemperatureUnit): number {
  const num = parseFloat(value) || 0;
  if (unit === 'fahrenheit') {
    return fahrenheitToCelsius(num);
  }
  return num;
}
