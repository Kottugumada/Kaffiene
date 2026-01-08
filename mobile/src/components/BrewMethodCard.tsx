import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrewMethodInfo } from '../types';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = spacing.sm;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.screenPadding * 2 - CARD_MARGIN) / 2;

interface BrewMethodCardProps {
  method: BrewMethodInfo;
  onPress: () => void;
  size?: 'large' | 'medium' | 'small';
  showDescription?: boolean;
}

export function BrewMethodCard({ 
  method, 
  onPress, 
  size = 'medium',
  showDescription = false,
}: BrewMethodCardProps) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  
  const cardHeight = isLarge ? 180 : isSmall ? 100 : 140;
  const iconSize = isLarge ? 56 : isSmall ? 32 : 44;
  const titleStyle = isLarge ? typography.h3 : isSmall ? typography.label : typography.h4;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.cardWrapper,
        isLarge && styles.cardWrapperLarge,
        isSmall && styles.cardWrapperSmall,
      ]}
    >
      <LinearGradient
        colors={method.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { height: cardHeight }]}
      >
        {/* Glass overlay */}
        <View style={styles.glassOverlay} />
        
        {/* Accent glow */}
        <View style={[styles.accentGlow, { backgroundColor: method.accentColor }]} />
        
        {/* Content */}
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: method.accentColor + '25' }]}>
            <Text style={[styles.icon, { fontSize: iconSize }]}>{method.icon}</Text>
          </View>
          
          <Text style={[styles.title, titleStyle]}>{method.name}</Text>
          
          {showDescription && !isSmall && (
            <Text style={styles.description} numberOfLines={2}>
              {method.description}
            </Text>
          )}
          
          {!isSmall && (
            <View style={styles.metaContainer}>
              <View style={[styles.badge, { backgroundColor: method.accentColor + '30' }]}>
                <Text style={[styles.badgeText, { color: method.accentColor }]}>
                  {formatDifficulty(method.difficulty)}
                </Text>
              </View>
              <Text style={styles.brewTime}>
                {formatBrewTime(method.brewTimeRange)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Bottom accent bar */}
        <View style={[styles.accentBar, { backgroundColor: method.accentColor }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

function formatDifficulty(difficulty: BrewMethodInfo['difficulty']): string {
  const labels = {
    beginner: 'Easy',
    intermediate: 'Medium',
    advanced: 'Advanced',
  };
  return labels[difficulty];
}

function formatBrewTime(range: { min: number; max: number }): string {
  const minMins = Math.floor(range.min / 60);
  const maxMins = Math.ceil(range.max / 60);
  
  if (minMins === maxMins) {
    return `${minMins}m`;
  }
  return `${minMins}-${maxMins}m`;
}

// Compact card for grid layouts
interface BrewMethodGridCardProps {
  method: BrewMethodInfo;
  onPress: () => void;
}

export function BrewMethodGridCard({ method, onPress }: BrewMethodGridCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.gridCardWrapper}
    >
      <LinearGradient
        colors={method.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gridCard}
      >
        <View style={styles.glassOverlay} />
        <View style={[styles.gridAccentGlow, { backgroundColor: method.accentColor }]} />
        
        <View style={styles.gridContent}>
          <View style={[styles.gridIconContainer, { backgroundColor: method.accentColor + '25' }]}>
            <Text style={styles.gridIcon}>{method.icon}</Text>
          </View>
          <Text style={styles.gridTitle}>{method.name}</Text>
          <Text style={styles.gridMeta}>{formatBrewTime(method.brewTimeRange)}</Text>
        </View>
        
        <View style={[styles.gridAccentBar, { backgroundColor: method.accentColor }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Main Card Styles
  cardWrapper: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.card + 4,
    ...shadows.lg,
  },
  cardWrapperLarge: {
    // Full width for large cards
  },
  cardWrapperSmall: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  card: {
    borderRadius: borderRadius.card + 4,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  accentGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.15,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  icon: {
    fontSize: 44,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.base,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  brewTime: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  
  // Grid Card Styles
  gridCardWrapper: {
    width: CARD_WIDTH,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.card,
    ...shadows.md,
  },
  gridCard: {
    height: 140,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    position: 'relative',
  },
  gridAccentGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.2,
  },
  gridContent: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  gridIcon: {
    fontSize: 28,
  },
  gridTitle: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  gridMeta: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  gridAccentBar: {
    height: 3,
    width: '100%',
  },
});

