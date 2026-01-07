// Service to load seed data and provide recommendations based on origin/roast
import { beanRepository } from '../repositories';
import { Bean, RoastLevel } from '../types';
import { SEED_BEANS } from '../data/seedBeans';
import { ORIGIN_RECIPES, ROAST_RECIPES, DEFAULT_ESPRESSO, getAverageValue, getRatioValue } from '../data/seedData';
import { EspressoParameters } from '../types';

export async function loadSeedBeans(): Promise<void> {
  const existingBeans = await beanRepository.findAll();
  const existingNames = new Set(existingBeans.map((b) => b.name.toLowerCase()));

  for (const seedBean of SEED_BEANS) {
    // Only add if it doesn't exist
    if (!existingNames.has(seedBean.name.toLowerCase())) {
      const id = `seed_${seedBean.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      await beanRepository.create({
        ...seedBean,
        id,
        isSeedData: true,
      });
    }
  }
}

export interface RecommendedParameters {
  dose: number;
  yield: number;
  ratio: number;
  time: number;
  temperature: number;
  pressure: number;
}

export function getRecommendedParameters(
  bean: Bean,
  shotType: 'single' | 'double' = 'double'
): RecommendedParameters {
  // Start with default
  let dose = DEFAULT_ESPRESSO.dose_g;
  let ratio = getRatioValue(DEFAULT_ESPRESSO.ratio);
  let temperature = DEFAULT_ESPRESSO.temp_c;
  let time = DEFAULT_ESPRESSO.time_sec;
  let pressure = DEFAULT_ESPRESSO.pressure_bar;

  // Adjust based on roast level
  const roastRecipe = ROAST_RECIPES[bean.roastLevel];
  if (roastRecipe) {
    dose = getAverageValue(roastRecipe.dose_g);
    ratio = getRatioValue(roastRecipe.ratio);
    temperature = getAverageValue(roastRecipe.temp_c);
    time = getAverageValue(roastRecipe.time_sec);
    pressure = roastRecipe.pressure_bar;
  }

  // Adjust based on origin (if available)
  if (bean.origin) {
    const originKey = bean.origin.toLowerCase().replace(/\s+/g, '_');
    const originRecipe = ORIGIN_RECIPES[originKey];
    if (originRecipe) {
      // Blend origin and roast recommendations
      const originDose = getAverageValue(originRecipe.dose_g);
      const originRatio = getRatioValue(originRecipe.ratio);
      const originTemp = getAverageValue(originRecipe.temp_c);
      const originTime = getAverageValue(originRecipe.time_sec);

      // Weighted average (60% roast, 40% origin)
      dose = dose * 0.6 + originDose * 0.4;
      ratio = ratio * 0.6 + originRatio * 0.4;
      temperature = temperature * 0.6 + originTemp * 0.4;
      time = time * 0.6 + originTime * 0.4;
    }
  }

  // Adjust for shot type
  if (shotType === 'single') {
    dose = dose / 2;
  }

  // Calculate yield from dose and ratio
  const yieldAmount = dose * ratio;

  return {
    dose: Math.round(dose * 10) / 10, // Round to 1 decimal
    yield: Math.round(yieldAmount * 10) / 10,
    ratio,
    time: Math.round(time),
    temperature: Math.round(temperature),
    pressure,
  };
}

export function getOriginFlavorNotes(origin: string): string[] {
  const originKey = origin.toLowerCase().replace(/\s+/g, '_');
  const recipe = ORIGIN_RECIPES[originKey];
  return recipe?.flavor_notes || [];
}

export function getRoastFlavorFocus(roastLevel: RoastLevel): string[] {
  const recipe = ROAST_RECIPES[roastLevel];
  return recipe?.flavor_focus || [];
}

