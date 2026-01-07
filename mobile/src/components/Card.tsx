import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, shadows, borderRadius } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, variant = 'default' }) => {
  const Container = onPress ? TouchableOpacity : View;

  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'flat' && styles.flat,
    style,
  ];

  return (
    <Container
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.cardPadding,
    marginVertical: spacing.sm,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  elevated: {
    ...shadows.lg,
    borderColor: colors.border,
  },
  flat: {
    ...shadows.sm,
    borderWidth: 0,
  },
});

