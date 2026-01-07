import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  leftLabel,
  rightLabel,
}) => {
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.sliderContainer}>
        {leftLabel && <Text style={styles.sideLabel}>{leftLabel}</Text>}
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
          <View
            style={[
              styles.thumb,
              { left: `${percentage}%`, marginLeft: -8 },
            ]}
          />
        </View>
        {rightLabel && <Text style={styles.sideLabel}>{rightLabel}</Text>}
      </View>
      <View style={styles.valueContainer}>
        <TouchableOpacity
          onPress={() => onValueChange(Math.max(minimumValue, value - step))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity
          onPress={() => onValueChange(Math.min(maximumValue, value + step))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    position: 'relative',
    marginHorizontal: spacing.sm,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: -6,
    borderWidth: 2,
    borderColor: colors.background,
  },
  sideLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    minWidth: 50,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  buttonText: {
    ...typography.h3,
    color: colors.primary,
  },
  value: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
  },
});

