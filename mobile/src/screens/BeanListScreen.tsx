import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBeanStore } from '../store';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { Bean, RoastLevel } from '../types';

// Get roast level color and icon
const getRoastStyle = (roastLevel: RoastLevel) => {
  switch (roastLevel) {
    case 'light':
      return { 
        gradient: ['#8B6914', '#A67C00', '#C4A000'] as const,
        icon: '🌅',
        label: 'Light'
      };
    case 'medium':
      return { 
        gradient: ['#5A2D24', '#6B3D34', '#7A4D44'] as const,
        icon: '☀️',
        label: 'Medium'
      };
    case 'dark':
      return { 
        gradient: ['#2A1412', '#3A1F1C', '#4A2520'] as const,
        icon: '🌙',
        label: 'Dark'
      };
    case 'espresso':
      return { 
        gradient: ['#1A0F0E', '#2A1412', '#3A1F1C'] as const,
        icon: '☕',
        label: 'Espresso'
      };
    default:
      return { 
        gradient: ['#3A1F1C', '#4A2520', '#5A2D24'] as const,
        icon: '☕',
        label: 'Medium'
      };
  }
};

export function BeanListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { beans, loadBeans, isLoading } = useBeanStore();
  const { showDialIn } = route.params || {};

  useEffect(() => {
    loadBeans();
  }, []);

  const renderBean = ({ item, index }: { item: Bean; index: number }) => {
    const roastStyle = getRoastStyle(item.roastLevel);
    
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (showDialIn) {
            if (item.isSeedData) {
              navigation.navigate('BeanEdit', { 
                beanId: item.id, 
                showDialIn: true 
              });
            } else {
              navigation.navigate('GuidedDialIn', { beanId: item.id });
            }
          } else {
            navigation.navigate('BeanEdit', { beanId: item.id });
          }
        }}
        style={styles.cardWrapper}
      >
        <LinearGradient
          colors={roastStyle.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.beanCard}
        >
          {/* Glass overlay */}
          <View style={styles.glassOverlay} />
          
          {/* Roast indicator */}
          <View style={styles.roastBadge}>
            <Text style={styles.roastIcon}>{roastStyle.icon}</Text>
            <Text style={styles.roastLabel}>{roastStyle.label}</Text>
          </View>
          
          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.beanName}>{item.name}</Text>
            {item.origin && (
              <View style={styles.originContainer}>
                <Text style={styles.originIcon}>📍</Text>
                <Text style={styles.originText}>{item.origin}</Text>
              </View>
            )}
            {item.notes && (
              <Text style={styles.notesText} numberOfLines={1}>{item.notes}</Text>
            )}
          </View>
          
          {/* Action hint */}
          {showDialIn && (
            <View style={styles.actionHint}>
              <Text style={styles.actionHintText}>
                {item.isSeedData ? 'Tap to customize & dial in →' : 'Tap to dial in →'}
              </Text>
            </View>
          )}
          
          {/* Accent bar */}
          <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {showDialIn ? 'Select Your Beans' : 'My Beans'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {showDialIn 
            ? 'Choose the coffee you want to dial in'
            : `${beans.length} bean${beans.length !== 1 ? 's' : ''} in your collection`
          }
        </Text>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BeanEdit', { beanId: null, showDialIn })}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButtonGradient}
        >
          <Text style={styles.addButtonText}>+ Add New Bean</Text>
        </LinearGradient>
      </TouchableOpacity>

      {beans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☕</Text>
          <Text style={styles.emptyTitle}>No beans added yet</Text>
          <Text style={styles.emptyDescription}>
            Add your first bean to start tracking your coffee journey
          </Text>
        </View>
      ) : (
        <FlatList
          data={beans}
          renderItem={renderBean}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.screenPadding,
    paddingTop: spacing.sm,
  },
  cardWrapper: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.card + 4,
    ...shadows.lg,
  },
  beanCard: {
    borderRadius: borderRadius.card + 4,
    overflow: 'hidden',
    minHeight: 120,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  roastBadge: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  roastIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  roastLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  cardContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  beanName: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  originContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  originIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  originText: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  notesText: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  actionHint: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.base,
  },
  actionHintText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    ...shadows.md,
  },
  addButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
