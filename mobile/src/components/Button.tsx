import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    variant === 'destructive' && styles.destructive,
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    !disabled && variant !== 'outline' && shadows.md,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    variant === 'destructive' && styles.destructiveText,
  ];

  const loaderColor = variant === 'outline' ? colors.primary : colors.textInverse;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.buttonHeight,
  },
  // Primary - Crema Orange (CTA)
  primary: {
    backgroundColor: colors.primary, // #E46A2E
  },
  // Secondary - Roasted Cocoa
  secondary: {
    backgroundColor: colors.secondary, // #5A2D24
  },
  // Outline - Transparent with border
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  // Destructive - Red
  destructive: {
    backgroundColor: colors.error, // #C23A2B
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...typography.label,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
  destructiveText: {
    color: '#FFFFFF',
  },
});
