import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Input, Button, StarRating, Slider, ImagePickerButton } from '../components';
import { useBrewLogStore, useBeanStore, useUserPreferencesStore } from '../store';
import { colors, spacing, typography, borderRadius } from '../theme';
import { BrewMethodId, BrewParameters, EspressoParameters, FilterCoffeeParameters, PourOverParameters, TurkishCoffeeParameters, IndianFilterParameters, ColdBrewParameters } from '../types';
import { calculateYield, calculateRatio } from '../utils/units';
import {
  formatWeight,
  formatVolume,
  formatTemperature,
  getWeightUnitLabel,
  getVolumeUnitLabel,
  getTemperatureUnitLabel,
  parseWeight,
  parseVolume,
  parseTemperature,
} from '../utils/unitFormatter';
import { getBrewMethod, getRecipeById, getRecipesByMethod } from '../data';

type RouteParams = {
  ShotLog: {
    methodId?: BrewMethodId;
    recipeId?: string;
    brewTime?: number;
  };
};

// Ratio options for different brew methods
const ESPRESSO_RATIOS = [
  { id: 'ristretto', name: 'Ristretto', ratio: 1.5 },
  { id: 'standard', name: 'Standard', ratio: 2.0 },
  { id: 'lungo', name: 'Lungo', ratio: 2.5 },
  { id: 'turbo', name: 'Turbo', ratio: 4.0 },
];

const FILTER_RATIOS = [
  { id: 'strong', name: 'Strong', ratio: 14.0 },
  { id: 'standard', name: 'Standard', ratio: 16.0 },
  { id: 'light', name: 'Light', ratio: 18.0 },
];

const IMMERSION_RATIOS = [
  { id: 'strong', name: 'Strong', ratio: 12.0 },
  { id: 'standard', name: 'Standard', ratio: 15.0 },
  { id: 'light', name: 'Light', ratio: 17.0 },
];

const TURKISH_RATIOS = [
  { id: 'strong', name: 'Strong', ratio: 8.0 },
  { id: 'standard', name: 'Standard', ratio: 10.0 },
  { id: 'light', name: 'Light', ratio: 12.0 },
];

const INDIAN_FILTER_RATIOS = [
  { id: 'strong', name: 'Strong', ratio: 5.0 },
  { id: 'standard', name: 'Standard', ratio: 6.0 },
  { id: 'mild', name: 'Mild', ratio: 8.0 },
];

const COLD_BREW_RATIOS = [
  { id: 'concentrate', name: 'Concentrate', ratio: 5.0 },
  { id: 'standard', name: 'Standard', ratio: 6.0 },
  { id: 'mild', name: 'Mild', ratio: 8.0 },
  { id: 'rtd', name: 'Ready-to-Drink', ratio: 12.0 },
];

function getRatiosForMethod(methodId: BrewMethodId) {
  switch (methodId) {
    case 'espresso':
      return ESPRESSO_RATIOS;
    case 'turkish':
      return TURKISH_RATIOS;
    case 'indian_filter':
      return INDIAN_FILTER_RATIOS;
    case 'cold_brew':
      return COLD_BREW_RATIOS;
    case 'french_press':
    case 'aeropress':
      return IMMERSION_RATIOS;
    default:
      return FILTER_RATIOS;
  }
}

function isEspressoMethod(methodId: BrewMethodId): boolean {
  return methodId === 'espresso';
}

export function ShotLogScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'ShotLog'>>();
  const { beans, loadBeans } = useBeanStore();
  const { addLog } = useBrewLogStore();
  const { preferences, loadPreferences } = useUserPreferencesStore();

  // Get params from navigation (from guided brew or direct access)
  const methodId = route.params?.methodId || 'espresso';
  const recipeId = route.params?.recipeId;
  const passedBrewTime = route.params?.brewTime;

  // Get method and recipe info
  const method = useMemo(() => getBrewMethod(methodId), [methodId]);
  const recipe = useMemo(() => recipeId ? getRecipeById(recipeId) : null, [recipeId]);
  const availableRatios = useMemo(() => getRatiosForMethod(methodId), [methodId]);
  const isEspresso = isEspressoMethod(methodId);

  // Form state - initialize from recipe if available
  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);
  const [selectedRatioId, setSelectedRatioId] = useState<string>('standard');
  const [customRatio, setCustomRatio] = useState<string>('');
  const [useCustomRatio, setUseCustomRatio] = useState(false);
  
  // Espresso-specific fields
  const [dose, setDose] = useState(recipe?.coffeeG?.toString() || '18');
  const [yieldAmount, setYieldAmount] = useState(recipe?.waterMl?.toString() || '36');
  
  // Non-espresso fields
  const [coffee, setCoffee] = useState(recipe?.coffeeG?.toString() || '20');
  const [water, setWater] = useState(recipe?.waterMl?.toString() || '320');
  
  // Common fields
  const [time, setTime] = useState(passedBrewTime?.toString() || recipe?.brewTimeSec?.toString() || '28');
  const [grind, setGrind] = useState(recipe?.grindSize || 50);
  const [temperature, setTemperature] = useState(recipe?.temperatureC?.toString() || '92');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    loadBeans();
    loadPreferences();
  }, []);

  // Initialize from recipe when it loads
  useEffect(() => {
    if (recipe && preferences) {
      // Convert from base units to display units
      const coffeeDisplay = formatWeight(recipe.coffeeG, preferences.coffeeWeightUnit);
      const waterDisplay = formatVolume(recipe.waterMl, preferences.liquidVolumeUnit);
      const tempDisplay = formatTemperature(recipe.temperatureC, preferences.temperatureUnit);
      
      setCoffee(coffeeDisplay);
      setWater(waterDisplay);
      setDose(coffeeDisplay);
      setYieldAmount(waterDisplay);
      setTemperature(tempDisplay);
      setGrind(recipe.grindSize);
      
      // Find matching ratio or use custom
      const matchingRatio = availableRatios.find(r => Math.abs(r.ratio - recipe.ratio) < 0.5);
      if (matchingRatio) {
        setSelectedRatioId(matchingRatio.id);
        setUseCustomRatio(false);
      } else {
        setCustomRatio(recipe.ratio.toString());
        setUseCustomRatio(true);
      }
      
      if (passedBrewTime) {
        setTime(passedBrewTime.toString());
      } else {
        setTime(recipe.brewTimeSec.toString());
      }
    }
  }, [recipe, passedBrewTime, availableRatios, preferences]);

  const currentRatio = useMemo(() => {
    if (useCustomRatio && customRatio) {
      return parseFloat(customRatio) || 2.0;
    }
    const selected = availableRatios.find(r => r.id === selectedRatioId);
    return selected?.ratio || 2.0;
  }, [useCustomRatio, customRatio, selectedRatioId, availableRatios]);

  const handleDoseChange = (value: string) => {
    setDose(value);
    if (!preferences) return;
    
    // Convert to base units for calculation
    const doseGrams = parseWeight(value, preferences.coffeeWeightUnit);
    if (doseGrams > 0 && isEspresso) {
      // Calculate yield in base units (ml)
      const yieldMl = doseGrams * currentRatio;
      // Convert back to display units
      const yieldDisplay = formatVolume(yieldMl, preferences.liquidVolumeUnit);
      setYieldAmount(yieldDisplay);
    }
  };

  const handleCoffeeChange = (value: string) => {
    setCoffee(value);
    if (!preferences) return;
    
    // Convert to base units for calculation
    const coffeeGrams = parseWeight(value, preferences.coffeeWeightUnit);
    if (coffeeGrams > 0 && !isEspresso) {
      // Calculate water in base units (ml)
      const waterMl = coffeeGrams * currentRatio;
      // Convert back to display units
      const waterDisplay = formatVolume(waterMl, preferences.liquidVolumeUnit);
      setWater(waterDisplay);
    }
  };

  const handleRatioSelect = (ratioId: string) => {
    setSelectedRatioId(ratioId);
    setUseCustomRatio(false);
    if (!preferences) return;
    
    const selected = availableRatios.find(r => r.id === ratioId);
    if (selected) {
      if (isEspresso) {
        const doseGrams = parseWeight(dose || '18', preferences.coffeeWeightUnit);
        const yieldMl = doseGrams * selected.ratio;
        setYieldAmount(formatVolume(yieldMl, preferences.liquidVolumeUnit));
      } else {
        const coffeeGrams = parseWeight(coffee || '20', preferences.coffeeWeightUnit);
        const waterMl = coffeeGrams * selected.ratio;
        setWater(formatVolume(waterMl, preferences.liquidVolumeUnit));
      }
    }
  };

  const handleCustomRatioChange = (value: string) => {
    setCustomRatio(value);
    setUseCustomRatio(true);
    if (!preferences) return;
    
    const ratioNum = parseFloat(value) || 0;
    if (ratioNum > 0) {
      if (isEspresso) {
        const doseGrams = parseWeight(dose || '18', preferences.coffeeWeightUnit);
        const yieldMl = doseGrams * ratioNum;
        setYieldAmount(formatVolume(yieldMl, preferences.liquidVolumeUnit));
      } else {
        const coffeeGrams = parseWeight(coffee || '20', preferences.coffeeWeightUnit);
        const waterMl = coffeeGrams * ratioNum;
        setWater(formatVolume(waterMl, preferences.liquidVolumeUnit));
      }
    }
  };

  const handleSave = async () => {
    if (!selectedBeanId) {
      return;
    }

    if (!preferences) return;
    
    // Convert display values back to base units for storage
    const doseGrams = parseWeight(dose || '0', preferences.coffeeWeightUnit);
    const yieldMl = parseVolume(yieldAmount || '0', preferences.liquidVolumeUnit);
    const coffeeGrams = parseWeight(coffee || '0', preferences.coffeeWeightUnit);
    const waterMl = parseVolume(water || '0', preferences.liquidVolumeUnit);
    const tempCelsius = parseTemperature(temperature || '92', preferences.temperatureUnit);
    
    let parameters: BrewParameters;
    
    if (isEspresso) {
      parameters = {
        dose: doseGrams,
        yield: yieldMl,
        time: parseFloat(time) || 0,
        grind,
        temperature: tempCelsius,
        ratio: currentRatio,
      } as EspressoParameters;
    } else if (methodId === 'turkish') {
      parameters = {
        coffee: coffeeGrams,
        water: waterMl,
        sugar: 0,
        temperature: tempCelsius,
        brewTime: parseFloat(time) || 0,
      } as TurkishCoffeeParameters;
    } else if (methodId === 'pour_over' || methodId === 'v60' || methodId === 'chemex') {
      parameters = {
        coffee: coffeeGrams,
        water: waterMl,
        grind,
        temperature: tempCelsius,
        totalTime: parseFloat(time) || 0,
        ratio: currentRatio,
      } as PourOverParameters;
    } else if (methodId === 'indian_filter') {
      parameters = {
        coffee: coffeeGrams,
        water: waterMl,
        grind,
        temperature: tempCelsius,
        brewTime: parseFloat(time) || 0,
        ratio: currentRatio,
      } as IndianFilterParameters;
    } else if (methodId === 'cold_brew') {
      parameters = {
        coffee: coffeeGrams,
        water: waterMl,
        grind,
        temperature: tempCelsius,
        brewTime: parseFloat(time) || 0,
        ratio: currentRatio,
        style: currentRatio <= 8 ? 'concentrate' : 'ready_to_drink',
      } as ColdBrewParameters;
    } else {
      parameters = {
        coffee: coffeeGrams,
        water: waterMl,
        grind,
        temperature: tempCelsius,
        brewTime: parseFloat(time) || 0,
        ratio: currentRatio,
      } as FilterCoffeeParameters;
    }

    try {
      await addLog({
        beanId: selectedBeanId,
        brewMethod: methodId,
        recipeId: recipeId,
        parameters,
        rating: rating > 0 ? rating : undefined,
        tasteNotes: notes || undefined,
        images: images.length > 0 ? images : undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving brew:', error);
    }
  };

  const accentColor = method?.accentColor || colors.primary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Method Header */}
      <View style={[styles.methodHeader, { backgroundColor: accentColor + '15' }]}>
        <Text style={styles.methodIcon}>{method?.icon || '☕'}</Text>
        <View>
          <Text style={[styles.methodName, { color: accentColor }]}>
            {method?.name || 'Espresso'}
          </Text>
          {recipe && (
            <Text style={styles.recipeName}>{recipe.name}</Text>
          )}
        </View>
      </View>

      {/* Bean Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Bean *</Text>
        <View style={styles.beanSelector}>
          {beans.map((bean) => (
            <TouchableOpacity
              key={bean.id}
              style={[
                styles.beanOption,
                selectedBeanId === bean.id && [styles.beanOptionSelected, { backgroundColor: accentColor, borderColor: accentColor }],
              ]}
              onPress={() => setSelectedBeanId(bean.id)}
            >
              <Text
                style={[
                  styles.beanOptionText,
                  selectedBeanId === bean.id && styles.beanOptionTextSelected,
                ]}
              >
                {bean.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ratio Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Ratio</Text>
        <View style={styles.ratioSelector}>
          {availableRatios.map((ratio) => (
            <TouchableOpacity
              key={ratio.id}
              style={[
                styles.ratioOption,
                selectedRatioId === ratio.id && !useCustomRatio && [styles.ratioOptionSelected, { backgroundColor: accentColor, borderColor: accentColor }],
              ]}
              onPress={() => handleRatioSelect(ratio.id)}
            >
              <Text
                style={[
                  styles.ratioText,
                  selectedRatioId === ratio.id && !useCustomRatio && styles.ratioTextSelected,
                ]}
              >
                {ratio.name}{'\n'}1:{ratio.ratio}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Custom Ratio Input */}
        <View style={styles.customRatioContainer}>
          <Text style={styles.customRatioLabel}>Custom ratio:</Text>
          <View style={styles.customRatioInput}>
            <Text style={styles.customRatioPrefix}>1:</Text>
            <View style={styles.customRatioFieldWrapper}>
              <Input
                value={customRatio}
                onChangeText={handleCustomRatioChange}
                keyboardType="decimal-pad"
                placeholder={currentRatio.toString()}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Parameters - Espresso Style */}
      {isEspresso ? (
        <>
          <Input
            label="Dose"
            value={dose}
            onChangeText={handleDoseChange}
            keyboardType="decimal-pad"
            unit={preferences ? getWeightUnitLabel(preferences.coffeeWeightUnit) : 'g'}
          />

          <Input
            label="Yield"
            value={yieldAmount}
            onChangeText={setYieldAmount}
            keyboardType="decimal-pad"
            unit={preferences ? getVolumeUnitLabel(preferences.liquidVolumeUnit) : 'ml'}
          />
        </>
      ) : (
        <>
          <Input
            label="Coffee"
            value={coffee}
            onChangeText={handleCoffeeChange}
            keyboardType="decimal-pad"
            unit={preferences ? getWeightUnitLabel(preferences.coffeeWeightUnit) : 'g'}
          />

          <Input
            label="Water"
            value={water}
            onChangeText={setWater}
            keyboardType="decimal-pad"
            unit={preferences ? getVolumeUnitLabel(preferences.liquidVolumeUnit) : 'ml'}
          />
        </>
      )}

      <Input
        label="Time"
        value={time}
        onChangeText={setTime}
        keyboardType="decimal-pad"
        unit="s"
      />

      <Slider
        label="Grind Size"
        value={grind}
        onValueChange={setGrind}
        minimumValue={0}
        maximumValue={100}
        leftLabel="Fine"
        rightLabel="Coarse"
      />

      <Input
        label="Temperature"
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="decimal-pad"
        unit={preferences ? getTemperatureUnitLabel(preferences.temperatureUnit) : '°C'}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Rating</Text>
        <StarRating rating={rating} onRatingChange={setRating} />
      </View>

      <Input
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="How did it taste?"
        multiline
      />

      <ImagePickerButton
        images={images}
        onImagesChange={setImages}
        maxImages={4}
      />

      <Button 
        title={`Save ${method?.name || 'Brew'}`} 
        onPress={handleSave} 
        fullWidth 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.card,
    marginBottom: spacing.lg,
    gap: spacing.base,
  },
  methodIcon: {
    fontSize: 32,
  },
  methodName: {
    ...typography.h4,
    fontWeight: '700',
  },
  recipeName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  beanSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  beanOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  beanOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  beanOptionText: {
    ...typography.body,
    color: colors.text,
  },
  beanOptionTextSelected: {
    color: '#FFFFFF',
  },
  ratioSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  ratioOption: {
    flex: 1,
    minWidth: 70,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  ratioOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ratioText: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'center',
  },
  ratioTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  customRatioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  customRatioLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  customRatioInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customRatioPrefix: {
    ...typography.body,
    color: colors.text,
    marginRight: spacing.xs,
  },
  customRatioFieldWrapper: {
    width: 100,
  },
});
