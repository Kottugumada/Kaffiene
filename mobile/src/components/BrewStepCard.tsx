import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrewStep } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

interface BrewStepCardProps {
  step: BrewStep;
  isActive?: boolean;
  isCompleted?: boolean;
  accentColor?: string;
  showDuration?: boolean;
}

export function BrewStepCard({
  step,
  isActive = false,
  isCompleted = false,
  accentColor = colors.primary,
  showDuration = true,
}: BrewStepCardProps) {
  return (
    <View style={[
      styles.card,
      isActive && styles.cardActive,
      isActive && { borderColor: accentColor },
      isCompleted && styles.cardCompleted,
    ]}>
      {/* Step number indicator */}
      <View style={[
        styles.stepIndicator,
        isActive && { backgroundColor: accentColor },
        isCompleted && styles.stepIndicatorCompleted,
      ]}>
        {isCompleted ? (
          <Text style={styles.stepCheck}>✓</Text>
        ) : (
          <Text style={[
            styles.stepNumber,
            isActive && styles.stepNumberActive,
          ]}>
            {step.order}
          </Text>
        )}
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            isActive && { color: accentColor },
            isCompleted && styles.titleCompleted,
          ]}>
            {step.title}
          </Text>
          
          {showDuration && step.durationSec && (
            <View style={[
              styles.durationBadge,
              isActive && { backgroundColor: accentColor + '20' },
            ]}>
              <Text style={[
                styles.durationText,
                isActive && { color: accentColor },
              ]}>
                {formatDuration(step.durationSec)}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={[
          styles.description,
          isCompleted && styles.descriptionCompleted,
        ]}>
          {step.description}
        </Text>
        
        {/* Targets */}
        {step.target && (
          <View style={styles.targets}>
            {step.target.waterG && (
              <View style={[styles.target, { backgroundColor: accentColor + '15' }]}>
                <Text style={[styles.targetValue, { color: accentColor }]}>
                  {step.target.waterG}g
                </Text>
                <Text style={styles.targetLabel}>water</Text>
              </View>
            )}
            {step.target.tempC && (
              <View style={[styles.target, { backgroundColor: accentColor + '15' }]}>
                <Text style={[styles.targetValue, { color: accentColor }]}>
                  {step.target.tempC}°C
                </Text>
                <Text style={styles.targetLabel}>temp</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Tips */}
        {step.tips && step.tips.length > 0 && isActive && (
          <View style={styles.tips}>
            {step.tips.map((tip, index) => (
              <View key={index} style={styles.tip}>
                <Text style={styles.tipBullet}>💡</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins}m`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Compact step indicator for progress bar
interface StepProgressProps {
  steps: BrewStep[];
  currentStep: number;
  accentColor?: string;
}

export function StepProgress({ steps, currentStep, accentColor = colors.primary }: StepProgressProps) {
  return (
    <View style={styles.progress}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        
        return (
          <React.Fragment key={step.order}>
            <View style={[
              styles.progressDot,
              isCompleted && { backgroundColor: accentColor },
              isActive && styles.progressDotActive,
              isActive && { borderColor: accentColor },
            ]}>
              {isCompleted && <Text style={styles.progressCheck}>✓</Text>}
            </View>
            
            {index < steps.length - 1 && (
              <View style={[
                styles.progressLine,
                isCompleted && { backgroundColor: accentColor },
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    backgroundColor: colors.backgroundSecondary,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  stepIndicatorCompleted: {
    backgroundColor: colors.success,
  },
  stepNumber: {
    ...typography.label,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.label,
    color: colors.text,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  durationBadge: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  durationText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  descriptionCompleted: {
    color: colors.textTertiary,
  },
  targets: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  targetValue: {
    ...typography.label,
    fontWeight: '700',
  },
  targetLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  tips: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipBullet: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  tipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  
  // Progress styles
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  progressCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: colors.backgroundTertiary,
  },
});

