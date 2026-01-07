import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
  error?: string;
  unit?: string;
  onUnitToggle?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  error,
  unit,
  onUnitToggle,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, multiline && styles.multiline, error && styles.error]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          multiline={multiline}
        />
        {unit && (
          <TouchableOpacity onPress={onUnitToggle} style={styles.unitButton}>
            <Text style={styles.unitText}>{unit}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    backgroundColor: colors.backgroundCard,
    minHeight: spacing.inputHeight,
  },
  input: {
    ...typography.body,
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight + '20', // 20% opacity
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  unitButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    borderTopRightRadius: borderRadius.input - 2,
    borderBottomRightRadius: borderRadius.input - 2,
  },
  unitText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
});

