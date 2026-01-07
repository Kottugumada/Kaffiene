// Service to load seed data and provide recommendations based on origin/roast
import { beanRepository } from '../repositories';
import { Bean, RoastLevel } from '../types';
import { SEED_BEANS } from '../data/seedBeans';
import { SEED_ESPRESSO_RECIPES, EspressoRecipe } from '../data/seedEspressoRecipes';
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
  // First, try to find a matching recipe from SEED_ESPRESSO_RECIPES
  // Priority: origin + processing > origin > roast level > default
  
  let matchedRecipe: EspressoRecipe | null = null;
  
  // Try to match origin + processing
  if (bean.origin && bean.processingMethod) {
    matchedRecipe = SEED_ESPRESSO_RECIPES.find(
      (r) =>
        r.appliesTo.origin?.toLowerCase() === bean.origin?.toLowerCase() &&
        r.appliesTo.processingMethod?.toLowerCase() === bean.processingMethod?.toLowerCase()
    ) || null;
  }
  
  // Try to match origin only
  if (!matchedRecipe && bean.origin) {
    matchedRecipe = SEED_ESPRESSO_RECIPES.find(
      (r) => r.appliesTo.origin?.toLowerCase() === bean.origin?.toLowerCase() && !r.appliesTo.processingMethod
    ) || null;
  }
  
  // Try to match processing only
  if (!matchedRecipe && bean.processingMethod) {
    matchedRecipe = SEED_ESPRESSO_RECIPES.find(
      (r) => r.appliesTo.processingMethod?.toLowerCase() === bean.processingMethod?.toLowerCase() && !r.appliesTo.origin
    ) || null;
  }
  
  // Try to match roast level
  if (!matchedRecipe) {
    matchedRecipe = SEED_ESPRESSO_RECIPES.find(
      (r) => r.appliesTo.roastLevel === bean.roastLevel && !r.appliesTo.origin && !r.appliesTo.processingMethod
    ) || null;
  }
  
  // Use matched recipe or fall back to default
  if (matchedRecipe) {
    let dose = matchedRecipe.doseG;
    const ratio = getRatioValue(matchedRecipe.ratio);
    const temperature = matchedRecipe.tempC;
    const timeRange = matchedRecipe.timeSec.split('–').map((t) => parseFloat(t.trim()));
    const time = (timeRange[0] + (timeRange[1] || timeRange[0])) / 2;
    
    // Adjust for shot type
    if (shotType === 'single') {
      dose = dose / 2;
    }
    
    const yieldAmount = dose * ratio;
    
    return {
      dose: Math.round(dose * 10) / 10,
      yield: Math.round(yieldAmount * 10) / 10,
      ratio,
      time: Math.round(time),
      temperature,
      pressure: DEFAULT_ESPRESSO.pressure_bar,
    };
  }
  
  // Fallback to original logic if no recipe matches
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

export function getMatchingRecipes(bean: Bean): EspressoRecipe[] {
  const matches: EspressoRecipe[] = [];
  
  for (const recipe of SEED_ESPRESSO_RECIPES) {
    let matchesBean = true;
    
    if (recipe.appliesTo.roastLevel && recipe.appliesTo.roastLevel !== bean.roastLevel) {
      matchesBean = false;
    }
    
    if (recipe.appliesTo.origin && recipe.appliesTo.origin.toLowerCase() !== bean.origin?.toLowerCase()) {
      matchesBean = false;
    }
    
    if (recipe.appliesTo.processingMethod && recipe.appliesTo.processingMethod.toLowerCase() !== bean.processingMethod?.toLowerCase()) {
      matchesBean = false;
    }
    
    if (matchesBean) {
      matches.push(recipe);
    }
  }
  
  // Sort by specificity (more specific matches first)
  return matches.sort((a, b) => {
    const aSpecificity = (a.appliesTo.roastLevel ? 1 : 0) + (a.appliesTo.origin ? 1 : 0) + (a.appliesTo.processingMethod ? 1 : 0);
    const bSpecificity = (b.appliesTo.roastLevel ? 1 : 0) + (b.appliesTo.origin ? 1 : 0) + (b.appliesTo.processingMethod ? 1 : 0);
    return bSpecificity - aSpecificity;
  });
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

