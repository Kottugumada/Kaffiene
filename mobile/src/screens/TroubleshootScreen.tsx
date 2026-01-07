import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '../components';
import { colors, spacing, typography } from '../theme';
import { TroubleshootingAnswer, TroubleshootingDiagnosis } from '../types';
import { diagnoseTroubleshooting } from '../services/recommendationService';
import { EspressoParameters } from '../types';
import { getRatioById } from '../services/ratioService';

export function TroubleshootScreen() {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TroubleshootingAnswer>({});
  const [diagnosis, setDiagnosis] = useState<TroubleshootingDiagnosis | null>(null);

  const questions = [
    {
      id: 'taste',
      question: 'How does your espresso taste?',
      options: [
        { value: 'sour', label: 'Sour / Sharp', icon: '🍋', description: 'Under-extracted' },
        { value: 'bitter', label: 'Bitter / Burnt', icon: '☕', description: 'Over-extracted' },
        { value: 'balanced', label: 'Balanced / Good', icon: '✓', description: 'Well-rounded' },
        { value: 'weak', label: 'Weak / Watery', icon: '💧', description: 'Thin, lacks body' },
        { value: 'too_strong', label: 'Too Strong', icon: '💪', description: 'Overwhelming' },
      ],
    },
    {
      id: 'flow',
      question: 'How does the espresso flow from the portafilter?',
      options: [
        { value: 'too_fast', label: 'Too Fast / Gushing', description: 'Streams out quickly' },
        { value: 'too_slow', label: 'Too Slow / Dripping', description: 'Drops slowly' },
        { value: 'just_right', label: 'Just Right', description: 'Steady, consistent stream' },
        { value: 'channeling', label: 'Channeling / Uneven', description: 'Sprays in different directions' },
      ],
    },
    {
      id: 'timing',
      question: 'How long did your shot take (from first drop to stop)?',
      options: [
        { value: 15, label: 'Under 20 seconds', description: 'Very fast' },
        { value: 22, label: '20-25 seconds', description: 'Fast' },
        { value: 28, label: '25-30 seconds', description: 'Normal range' },
        { value: 32, label: '30-35 seconds', description: 'Slow' },
        { value: 40, label: 'Over 35 seconds', description: 'Very slow' },
      ],
    },
  ];

  const handleAnswer = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, generate diagnosis
      const mockShot: EspressoParameters = {
        dose: 18,
        yield: 36,
        time: answers.timing || 28,
        grind: 50,
        temperature: 92,
        ratio: 2.0,
      };
      const ratioDef = getRatioById('espresso_standard')!;
      const diag = diagnoseTroubleshooting(newAnswers, mockShot, ratioDef);
      setDiagnosis(diag);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  if (diagnosis) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.diagnosisCard}>
          <Text style={styles.diagnosisTitle}>Primary Change</Text>
          <Text style={styles.adjustmentType}>
            {diagnosis.primaryAdjustment.type === 'grind'
              ? diagnosis.primaryAdjustment.direction === 'finer'
                ? 'Grind Finer'
                : 'Grind Coarser'
              : diagnosis.primaryAdjustment.type}
          </Text>
          <Text style={styles.adjustmentMagnitude}>
            {diagnosis.primaryAdjustment.magnitude}
          </Text>
          <Text style={styles.explanation}>{diagnosis.explanation}</Text>
        </Card>

        {diagnosis.secondaryAdjustment && (
          <Card style={styles.diagnosisCard}>
            <Text style={styles.diagnosisTitle}>Optional Change</Text>
            <Text style={styles.adjustmentType}>
              {diagnosis.secondaryAdjustment.type}
            </Text>
            <Text style={styles.adjustmentMagnitude}>
              {diagnosis.secondaryAdjustment.magnitude}
            </Text>
          </Card>
        )}

        <Button
          title="Apply to Next Shot"
          onPress={() => (navigation as any).navigate('ShotLog')}
          fullWidth
        />
        <Button
          title="Done"
          onPress={() => navigation.goBack()}
          variant="outline"
          fullWidth
        />
      </ScrollView>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>{currentQ.question}</Text>

        {currentQ.options.map((option) => (
          <Card
            key={option.value}
            onPress={() => handleAnswer(currentQ.id, option.value)}
            style={styles.optionCard}
          >
            {'icon' in option && option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              {option.description && (
                <Text style={styles.optionDescription}>{option.description}</Text>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.navigation}>
        <Button title="Back" onPress={handleBack} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.sm,
  },
  content: {
    padding: spacing.base,
  },
  question: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  optionCard: {
    marginBottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: spacing.base,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  navigation: {
    padding: spacing.base,
  },
  diagnosisCard: {
    marginBottom: spacing.base,
  },
  diagnosisTitle: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  adjustmentType: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  adjustmentMagnitude: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  explanation: {
    ...typography.body,
    color: colors.text,
  },
});

