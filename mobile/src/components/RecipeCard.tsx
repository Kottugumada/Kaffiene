import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrewRecipe } from '../types';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';

interface RecipeCardProps {
  recipe: BrewRecipe;
  onPress: () => void;
  accentColor?: string;
  isSelected?: boolean;
}

export function RecipeCard({ 
  recipe, 
  onPress, 
  accentColor = colors.primary,
  isSelected = false,
}: RecipeCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isSelected && { borderColor: accentColor },
      ]}
    >
      {/* Default badge */}
      {recipe.isDefault && (
        <View style={[styles.defaultBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.ratio}>1:{recipe.ratio}</Text>
      </View>
      
      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {recipe.description}
      </Text>
      
      {/* Parameters */}
      <View style={styles.params}>
        <View style={styles.param}>
          <Text style={styles.paramValue}>{recipe.coffeeG}g</Text>
          <Text style={styles.paramLabel}>Coffee</Text>
        </View>
        <View style={styles.paramDivider} />
        <View style={styles.param}>
          <Text style={styles.paramValue}>{recipe.waterMl}ml</Text>
          <Text style={styles.paramLabel}>Water</Text>
        </View>
        <View style={styles.paramDivider} />
        <View style={styles.param}>
          <Text style={styles.paramValue}>{recipe.temperatureC}°C</Text>
          <Text style={styles.paramLabel}>Temp</Text>
        </View>
        <View style={styles.paramDivider} />
        <View style={styles.param}>
          <Text style={styles.paramValue}>{formatTime(recipe.brewTimeSec)}</Text>
          <Text style={styles.paramLabel}>Time</Text>
        </View>
      </View>
      
      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <View style={styles.tags}>
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: accentColor + '20' }]}
            >
              <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <View style={[styles.selectionIndicator, { backgroundColor: accentColor }]}>
          <Text style={styles.selectionCheck}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Compact version for lists
interface RecipeListItemProps {
  recipe: BrewRecipe;
  onPress: () => void;
  accentColor?: string;
}

export function RecipeListItem({ recipe, onPress, accentColor = colors.primary }: RecipeListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.listItem}
    >
      <View style={styles.listItemContent}>
        <View style={styles.listItemHeader}>
          <Text style={styles.listItemTitle}>{recipe.name}</Text>
          {recipe.isDefault && (
            <View style={[styles.listItemBadge, { backgroundColor: accentColor + '20' }]}>
              <Text style={[styles.listItemBadgeText, { color: accentColor }]}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.listItemMeta}>
          {recipe.coffeeG}g • {recipe.waterMl}ml • {formatTime(recipe.brewTimeSec)}
        </Text>
      </View>
      <Text style={styles.listItemArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.base,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.md,
  },
  cardSelected: {
    borderWidth: 2,
  },
  defaultBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  ratio: {
    ...typography.label,
    color: colors.textSecondary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  params: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  param: {
    flex: 1,
    alignItems: 'center',
  },
  paramValue: {
    ...typography.label,
    color: colors.text,
    fontWeight: '700',
  },
  paramLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  paramDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: spacing.base,
    right: spacing.base,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // List Item Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  listItemContent: {
    flex: 1,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listItemTitle: {
    ...typography.label,
    color: colors.text,
  },
  listItemBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  listItemBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  listItemMeta: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
  },
  listItemArrow: {
    fontSize: 24,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});

