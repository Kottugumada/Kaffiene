import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Input, Button, StarRating, Slider, Card } from '../components';
import { useBrewLogStore, useBeanStore } from '../store';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { EspressoParameters, BrewMethod } from '../types';
import { calculateYield, calculateRatio } from '../utils/units';
import { getRecommendedParameters, getMatchingRecipes } from '../services/seedDataService';

interface DialInStep {
  id: number;
  title: string;
  content: string;
  showParameters: boolean;
  showTaste: boolean;
  allowNext: boolean;
}

const DIAL_IN_STEPS: DialInStep[] = [
  {
    id: 0,
    title: 'Set Your Intention',
    content: 'This is a new coffee. We\'re finding its center.\n\nBefore changing anything:\n• Use fresh beans (ideally 5–14 days off roast)\n• Clean basket & portafilter\n• Use the same cup each time\n• Change one variable at a time',
    showParameters: false,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 1,
    title: 'Start with Baseline',
    content: 'Use this as your default starting recipe:\n\n• Dose: 18g\n• Ratio: 1:2 (36g out)\n• Time target: 25–30 sec\n• Temperature: 93°C\n• Pressure: ~9 bar\n\nThis is not "the goal." This is the reference point.',
    showParameters: true,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 2,
    title: 'Dial Grind First',
    content: 'Pull your first shot and observe — don\'t judge yet.\n\nIf the shot:\n• Runs in under 20 sec → Grind finer\n• Takes over 35 sec → Grind coarser\n• Lands 25–30 sec → Grind is close enough\n\n📌 Rule: Do not change dose or ratio yet.',
    showParameters: true,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 3,
    title: 'Taste the Shot',
    content: 'Now evaluate flavor:\n\n• Very sour → Under-extracted\n• Very bitter / harsh → Over-extracted\n• Flat / hollow → Poor extraction balance\n• Sweet / pleasant → You\'re close\n\nIf sour or bitter but time is good, don\'t touch grind yet.',
    showParameters: true,
    showTaste: true,
    allowNext: true,
  },
  {
    id: 4,
    title: 'Adjust Ratio',
    content: 'Now fine-tune how much you extract, not how fast.\n\nIf the shot is:\n• Sour but timed well → Pull longer ratio (1:2 → 1:2.2 or 1:2.5)\n• Bitter but timed well → Pull shorter ratio (1:2 → 1:1.8 or 1:1.6)\n\n📌 Keep the grind the same.',
    showParameters: true,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 5,
    title: 'Re-taste & Confirm',
    content: 'Pull again and check:\n• Sweetness\n• Clarity\n• Aftertaste\n\nIf:\n• Improvement → lock this in as your working recipe\n• Still off → make one more small ratio adjustment\n\nAvoid chasing perfection.',
    showParameters: true,
    showTaste: true,
    allowNext: true,
  },
  {
    id: 6,
    title: 'Adjust Dose (If Needed)',
    content: 'Only touch dose if:\n• Shot feels thin even when well-extracted → +0.5–1g dose\n• Shot feels muddy even when balanced → –0.5–1g dose\n\n📌 Dose changes require rechecking grind.',
    showParameters: true,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 7,
    title: 'Fine-Tune Temperature',
    content: 'Only after grind + ratio + dose feel right.\n\n• Light roasts: 94–96°C\n• Medium roasts: 92–94°C\n• Dark roasts: 90–92°C\n\nSmall changes (1–2°C max).',
    showParameters: true,
    showTaste: false,
    allowNext: true,
  },
  {
    id: 8,
    title: 'Lock It In & Log',
    content: 'Once it tastes good:\n• Save the recipe\n• Log the shot\n• Note tasting impressions\n\n"This is today\'s truth."\n\nBeans evolve. You\'ll revisit later.',
    showParameters: true,
    showTaste: true,
    allowNext: true,
  },
  {
    id: 9,
    title: 'How Was Your Shot?',
    content: 'Tell us about your final shot:\n\n• Rate the shot\n• Add any tasting notes\n• This helps us learn and improve recommendations',
    showParameters: false,
    showTaste: true,
    allowNext: true,
  },
];

export function GuidedDialInScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { beanId } = route.params || {};
  const { beans, loadBeans } = useBeanStore();
  const { addLog } = useBrewLogStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [dose, setDose] = useState('18');
  const [yieldAmount, setYieldAmount] = useState('36');
  const [time, setTime] = useState('28');
  const [grind, setGrind] = useState(50);
  const [temperature, setTemperature] = useState('93');
  const [pressure, setPressure] = useState('9');
  const [rating, setRating] = useState(0);
  const [tasteNotes, setTasteNotes] = useState('');
  const [selectedRatio, setSelectedRatio] = useState('1:2');

  const selectedBean = beans.find((b) => b.id === beanId);

  useEffect(() => {
    loadBeans();
  }, []);

  useEffect(() => {
    // Set recommended parameters when bean is selected and on step 1
    if (selectedBean && currentStep === 1) {
      const recommended = getRecommendedParameters(selectedBean);
      setDose(recommended.dose.toString());
      setYieldAmount(recommended.yield.toString());
      setTime(recommended.time.toString());
      setTemperature(recommended.temperature.toString());
      setPressure(recommended.pressure.toString());
      setSelectedRatio(`1:${recommended.ratio}`);
    }
  }, [selectedBean, currentStep]);
  
  const step = DIAL_IN_STEPS[currentStep];
  const isLastStep = currentStep === DIAL_IN_STEPS.length - 1;
  
  // Compute recommended recipe for step 1
  let recommendedRecipe: { recipe: any; params: any } | null = null;
  if (selectedBean && currentStep === 1) {
    const matchingRecipes = getMatchingRecipes(selectedBean);
    const recommended = getRecommendedParameters(selectedBean);
    if (matchingRecipes.length > 0) {
      recommendedRecipe = { recipe: matchingRecipes[0], params: recommended };
    }
  }

  const handleDoseChange = (value: string) => {
    setDose(value);
    const doseNum = parseFloat(value) || 0;
    const ratio = parseFloat(selectedRatio.split(':')[1]);
    if (doseNum > 0 && ratio > 0) {
      const calculatedYield = calculateYield(doseNum, ratio);
      setYieldAmount(calculatedYield.toFixed(1));
    }
  };

  const handleRatioChange = (ratio: string) => {
    setSelectedRatio(ratio);
    const doseNum = parseFloat(dose) || 0;
    const ratioNum = parseFloat(ratio.split(':')[1]);
    if (doseNum > 0 && ratioNum > 0) {
      const calculatedYield = calculateYield(doseNum, ratioNum);
      setYieldAmount(calculatedYield.toFixed(1));
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      // On the very last step (taste feedback), save and finish
      await handleSave();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSave = async () => {
    if (!beanId) {
      return;
    }

    const parameters: EspressoParameters = {
      dose: parseFloat(dose) || 0,
      yield: parseFloat(yieldAmount) || 0,
      time: parseFloat(time) || 0,
      grind,
      temperature: parseFloat(temperature) || 93,
      pressure: parseFloat(pressure) || 9,
      ratio: calculateRatio(parseFloat(dose) || 0, 'grams', parseFloat(yieldAmount) || 0, 'ml'),
    };

    try {
      await addLog({
        beanId,
        brewMethod: 'espresso' as BrewMethod,
        parameters,
        rating: rating > 0 ? rating : undefined,
        tasteNotes: tasteNotes || undefined,
      });
      // Navigate back to home after saving
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      console.error('Error saving shot:', error);
    }
  };

  const progress = ((currentStep + 1) / DIAL_IN_STEPS.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {DIAL_IN_STEPS.length}
        </Text>
        <Text style={styles.stepTitle}>{step.title}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.instructionCard}>
          <Text style={styles.instructionText}>{step.content}</Text>
        </Card>

        {selectedBean && (
          <Card style={styles.beanCard}>
            <Text style={styles.beanName}>{selectedBean.name}</Text>
            <Text style={styles.beanDetails}>
              {selectedBean.roastLevel} roast{selectedBean.origin ? ` • ${selectedBean.origin}` : null}
            </Text>
            {recommendedRecipe && (
              <View style={styles.recipeCard}>
                <Text style={styles.recipeLabel}>Recommended Recipe:</Text>
                <Text style={styles.recipeName}>{recommendedRecipe.recipe.name}</Text>
                <Text style={styles.recipeDetails}>
                  {recommendedRecipe.params.dose}g in → {recommendedRecipe.params.yield}g out • {recommendedRecipe.params.time}s • {recommendedRecipe.params.temperature}°C
                </Text>
              </View>
            )}
          </Card>
        )}

        {step.showParameters && (
          <View style={styles.parametersSection}>
            <Text style={styles.sectionTitle}>Shot Parameters</Text>
            
            {(currentStep === 1 || currentStep === 4) && (
              <View style={styles.ratioSelector}>
                <Text style={styles.label}>Ratio</Text>
                <View style={styles.ratioOptions}>
                  {['1:1.5', '1:1.8', '1:2', '1:2.2', '1:2.5'].map((ratio) => (
                    <TouchableOpacity
                      key={ratio}
                      style={[
                        styles.ratioOption,
                        selectedRatio === ratio && styles.ratioOptionSelected,
                      ]}
                      onPress={() => handleRatioChange(ratio)}
                    >
                      <Text
                        style={[
                          styles.ratioText,
                          selectedRatio === ratio && styles.ratioTextSelected,
                        ]}
                      >
                        {ratio}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <Input
              label="Dose (grams)"
              value={dose}
              onChangeText={handleDoseChange}
              keyboardType="decimal-pad"
              unit="g"
            />

            <Input
              label="Yield (milliliters)"
              value={yieldAmount}
              onChangeText={setYieldAmount}
              keyboardType="decimal-pad"
              unit="ml"
            />

            <Input
              label="Time (seconds)"
              value={time}
              onChangeText={setTime}
              keyboardType="decimal-pad"
              unit="s"
            />

            {currentStep >= 2 && (
              <Slider
                label="Grind Size"
                value={grind}
                onValueChange={setGrind}
                minimumValue={0}
                maximumValue={100}
                leftLabel="Fine"
                rightLabel="Coarse"
              />
            )}

            {currentStep >= 7 && (
              <Input
                label="Temperature"
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="decimal-pad"
                unit="°C"
              />
            )}

            {currentStep === 1 && (
              <Input
                label="Pressure (optional)"
                value={pressure}
                onChangeText={setPressure}
                keyboardType="decimal-pad"
                unit="bar"
              />
            )}
          </View>
        )}

        {step.showTaste && (
          <View style={styles.tasteSection}>
            <Text style={styles.sectionTitle}>How did it taste?</Text>
            <View style={styles.ratingContainer}>
              <StarRating rating={rating} onRatingChange={setRating} size={32} />
            </View>
            <Input
              label="Taste Notes (optional)"
              value={tasteNotes}
              onChangeText={setTasteNotes}
              placeholder="Sweet, balanced, sour, bitter..."
              multiline
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          onPress={handleBack}
          variant="outline"
          style={styles.backButton}
        />
        <Button
          title={isLastStep ? 'Save & Finish' : 'Next'}
          onPress={handleNext}
          style={styles.nextButton}
          fullWidth={currentStep === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.backgroundCard,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.screenPadding,
    ...shadows.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xs,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.screenPadding,
  },
  instructionCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.accentLight + '30', // 30% opacity
    borderColor: colors.accent,
    borderWidth: 1,
  },
  instructionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  beanCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundCard,
  },
  beanName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  beanDetails: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  recipeCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.card,
  },
  recipeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  recipeName: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  recipeDetails: {
    ...typography.bodySmall,
    color: colors.text,
  },
  parametersSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.base,
    fontWeight: '700',
  },
  ratioSelector: {
    marginBottom: spacing.base,
  },
  ratioOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  ratioOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    minWidth: 60,
    alignItems: 'center',
  },
  ratioOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ratioText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  ratioTextSelected: {
    color: colors.textInverse,
  },
  tasteSection: {
    marginBottom: spacing.lg,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
    paddingVertical: spacing.base,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.screenPadding,
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.base,
    ...shadows.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});

