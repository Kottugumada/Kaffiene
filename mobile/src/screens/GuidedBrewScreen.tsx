import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  Vibration,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrewStepCard, StepProgress } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { getBrewMethod, getRecipeById, getDefaultRecipe } from '../data';
import { BrewMethodId, BrewStep, BrewRecipe } from '../types';

type RouteParams = {
  GuidedBrew: {
    methodId: BrewMethodId;
    recipeId: string;
  };
};

type BrewState = 'ready' | 'brewing' | 'paused' | 'completed';

export function GuidedBrewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'GuidedBrew'>>();
  const { methodId, recipeId } = route.params;

  const method = getBrewMethod(methodId);
  const recipe = getRecipeById(recipeId) || getDefaultRecipe(methodId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [brewState, setBrewState] = useState<BrewState>('ready');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepElapsedTime, setStepElapsedTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const steps = recipe?.steps || [];
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  // Timer logic
  useEffect(() => {
    if (brewState === 'brewing') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setStepElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [brewState]);

  // Step timer completion
  useEffect(() => {
    if (currentStep?.durationSec && stepElapsedTime >= currentStep.durationSec && brewState === 'brewing') {
      // Haptic feedback when step timer completes
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 100, 100, 100]);
      }
    }
  }, [stepElapsedTime, currentStep?.durationSec, brewState]);

  // Animate progress
  useEffect(() => {
    if (currentStep?.durationSec && brewState === 'brewing') {
      const progress = Math.min(stepElapsedTime / currentStep.durationSec, 1);
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [stepElapsedTime, currentStep?.durationSec, brewState]);

  const handleStart = useCallback(() => {
    setBrewState('brewing');
  }, []);

  const handlePause = useCallback(() => {
    setBrewState('paused');
  }, []);

  const handleResume = useCallback(() => {
    setBrewState('brewing');
  }, []);

  const handleNextStep = useCallback(() => {
    if (isLastStep) {
      setBrewState('completed');
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 200, 100, 200, 100, 200]);
      }
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setStepElapsedTime(0);
      progressAnim.setValue(0);
      
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    }
  }, [isLastStep, progressAnim]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setStepElapsedTime(0);
      progressAnim.setValue(0);
    }
  }, [currentStepIndex, progressAnim]);

  const handleFinish = useCallback(() => {
    // TODO: Navigate to log screen or save brew
    navigation.navigate('ShotLog', {
      methodId,
      recipeId,
      brewTime: elapsedTime,
    });
  }, [navigation, methodId, recipeId, elapsedTime]);

  const handleExit = useCallback(() => {
    if (brewState === 'brewing' || brewState === 'paused') {
      Alert.alert(
        'Exit Brewing?',
        'Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [brewState, navigation]);

  if (!method || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  const accentColor = method.accentColor;

  // Completed state
  if (brewState === 'completed') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={method.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.completedContainer}
        >
          <View style={styles.heroGlassOverlay} />
          <View style={[styles.completedIcon, { backgroundColor: accentColor + '30' }]}>
            <Text style={styles.completedEmoji}>✨</Text>
          </View>
          <Text style={styles.completedTitle}>Brew Complete!</Text>
          <Text style={styles.completedTime}>
            Total time: {formatTime(elapsedTime)}
          </Text>
          
          <View style={styles.completedActions}>
            <TouchableOpacity
              onPress={handleFinish}
              style={[styles.completedButton, { backgroundColor: accentColor }]}
            >
              <Text style={styles.completedButtonText}>Log This Brew</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.completedButtonSecondary}
            >
              <Text style={styles.completedButtonSecondaryText}>Done</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={method.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.heroGlassOverlay} />
        
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleExit} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.methodName}>{method.name}</Text>
          </View>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Total</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>

        {/* Step Progress */}
        <StepProgress
          steps={steps}
          currentStep={currentStepIndex}
          accentColor={accentColor}
        />
        
        <View style={[styles.headerAccentBar, { backgroundColor: accentColor }]} />
      </LinearGradient>

      {/* Current Step */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Timer (if applicable) */}
        {currentStep?.durationSec && (
          <View style={styles.stepTimerContainer}>
            <View style={styles.stepTimerRing}>
              <Animated.View
                style={[
                  styles.stepTimerProgress,
                  {
                    backgroundColor: accentColor,
                    transform: [{
                      rotate: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    }],
                  },
                ]}
              />
              <View style={styles.stepTimerInner}>
                <Text style={[styles.stepTimerValue, { color: accentColor }]}>
                  {formatTime(Math.max(0, currentStep.durationSec - stepElapsedTime))}
                </Text>
                <Text style={styles.stepTimerLabel}>
                  {stepElapsedTime >= currentStep.durationSec ? 'Done!' : 'remaining'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Current Step Card */}
        <View style={styles.currentStepContainer}>
          <Text style={styles.stepLabel}>
            Step {currentStep.order} of {steps.length}
          </Text>
          <Text style={[styles.stepTitle, { color: accentColor }]}>
            {currentStep.title}
          </Text>
          <Text style={styles.stepDescription}>
            {currentStep.description}
          </Text>

          {/* Targets */}
          {currentStep.target && (
            <View style={styles.targetsContainer}>
              {currentStep.target.waterG && (
                <View style={[styles.targetBadge, { backgroundColor: accentColor + '15' }]}>
                  <Text style={[styles.targetValue, { color: accentColor }]}>
                    {currentStep.target.waterG}g
                  </Text>
                  <Text style={styles.targetLabel}>water</Text>
                </View>
              )}
              {currentStep.target.tempC && (
                <View style={[styles.targetBadge, { backgroundColor: accentColor + '15' }]}>
                  <Text style={[styles.targetValue, { color: accentColor }]}>
                    {currentStep.target.tempC}°C
                  </Text>
                  <Text style={styles.targetLabel}>temp</Text>
                </View>
              )}
            </View>
          )}

          {/* Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              {currentStep.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>💡</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Upcoming Steps */}
        {currentStepIndex < steps.length - 1 && (
          <View style={styles.upcomingContainer}>
            <Text style={styles.upcomingTitle}>Coming Up</Text>
            {steps.slice(currentStepIndex + 1, currentStepIndex + 3).map((step) => (
              <BrewStepCard
                key={step.order}
                step={step}
                accentColor={accentColor}
                showDuration={true}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {brewState === 'ready' ? (
          <TouchableOpacity
            onPress={handleStart}
            style={[styles.primaryButton, { backgroundColor: accentColor }]}
          >
            <Text style={styles.primaryButtonText}>Start Brewing</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.controlsRow}>
            {/* Previous */}
            <TouchableOpacity
              onPress={handlePrevStep}
              disabled={currentStepIndex === 0}
              style={[
                styles.controlButton,
                currentStepIndex === 0 && styles.controlButtonDisabled,
              ]}
            >
              <Text style={styles.controlButtonText}>← Prev</Text>
            </TouchableOpacity>

            {/* Play/Pause */}
            <TouchableOpacity
              onPress={brewState === 'brewing' ? handlePause : handleResume}
              style={[styles.playPauseButton, { backgroundColor: accentColor }]}
            >
              <Text style={styles.playPauseIcon}>
                {brewState === 'brewing' ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>

            {/* Next */}
            <TouchableOpacity
              onPress={handleNextStep}
              style={[styles.controlButton, styles.controlButtonNext]}
            >
              <Text style={[styles.controlButtonText, styles.controlButtonTextNext]}>
                {isLastStep ? 'Finish' : 'Next →'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Header
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.screenPadding,
  },
  heroGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.base,
  },
  recipeName: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  methodName: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  timerValue: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  headerAccentBar: {
    height: 3,
    marginTop: spacing.base,
    marginHorizontal: -spacing.screenPadding,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    paddingBottom: 120,
  },

  // Step Timer
  stepTimerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepTimerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  stepTimerProgress: {
    position: 'absolute',
    width: 8,
    height: 80,
    top: 0,
    left: 76,
    borderRadius: 4,
    transformOrigin: 'center bottom',
  },
  stepTimerInner: {
    alignItems: 'center',
  },
  stepTimerValue: {
    ...typography.display,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  stepTimerLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Current Step
  currentStepContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  stepLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 28,
  },
  targetsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  targetValue: {
    ...typography.h4,
    fontWeight: '700',
  },
  targetLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  tipsContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },

  // Upcoming
  upcomingContainer: {
    marginTop: spacing.lg,
  },
  upcomingTitle: {
    ...typography.label,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },

  // Controls
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    height: spacing.buttonHeight,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.button,
    marginHorizontal: spacing.xs,
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  controlButtonNext: {
    backgroundColor: colors.backgroundTertiary,
  },
  controlButtonText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  controlButtonTextNext: {
    color: colors.text,
    fontWeight: '600',
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  playPauseIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },

  // Completed
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  completedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  completedEmoji: {
    fontSize: 64,
  },
  completedTitle: {
    ...typography.h1,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
  },
  completedTime: {
    ...typography.bodyLarge,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xxl,
  },
  completedActions: {
    width: '100%',
    gap: spacing.base,
  },
  completedButton: {
    height: spacing.buttonHeight,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButtonText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  completedButtonSecondary: {
    height: spacing.buttonHeight,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  completedButtonSecondaryText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

