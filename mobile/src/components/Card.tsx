import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Text } from 'react-native';
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

  // Wrap primitive children (string, number) in Text component for React Native compatibility
  // Use React.Children.map to properly handle arrays and fragments
  const wrappedChildren = React.Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <Text>{child}</Text>;
    }
    return child;
  });

  return (
    <Container
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
    >
      {wrappedChildren}
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

