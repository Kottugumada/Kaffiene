import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, BrewMethodCard, BrewMethodGridCard } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { useBrewLogStore, useBeanStore, useUserPreferencesStore } from '../store';
import { getFeaturedBrewMethods, BREW_METHODS } from '../data';
import { BrewMethodInfo, BrewMethodId } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Espresso shot types for expandable tile
const ESPRESSO_SHOT_TYPES = [
  { id: 'modern', name: 'Modern', icon: '☕', ratio: '1:2' },
  { id: 'ristretto', name: 'Ristretto', icon: '🔥', ratio: '1:1.5' },
  { id: 'lungo', name: 'Lungo', icon: '💧', ratio: '1:2.5' },
  { id: 'turbo', name: 'Turbo', icon: '⚡', ratio: '1:4' },
];

interface ShotTypeButtonProps {
  type: typeof ESPRESSO_SHOT_TYPES[0];
  onPress: () => void;
  accentColor: string;
}

function ShotTypeButton({ type, onPress, accentColor }: ShotTypeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.shotTypeButton}
    >
      <View style={[styles.shotTypeIcon, { backgroundColor: accentColor + '25' }]}>
        <Text style={styles.shotTypeEmoji}>{type.icon}</Text>
      </View>
      <Text style={styles.shotTypeName}>{type.name}</Text>
      <Text style={styles.shotTypeRatio}>{type.ratio}</Text>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { loadLogs, logs } = useBrewLogStore();
  const { loadPreferences } = useUserPreferencesStore();
  const { beans, loadBeans } = useBeanStore();
  const [espressoExpanded, setEspressoExpanded] = useState(false);

  useEffect(() => {
    loadPreferences();
    loadLogs(5);
    loadBeans();
  }, []);

  const recentShots = logs.slice(0, 3);
  const featuredMethods = getFeaturedBrewMethods();
  const espressoMethod = BREW_METHODS.espresso;

  const toggleEspresso = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEspressoExpanded(!espressoExpanded);
  };

  const handleBrewMethodPress = (method: BrewMethodInfo) => {
    if (method.id === 'espresso') {
      toggleEspresso();
    } else {
      navigation.navigate('BrewMethodDetail', { methodId: method.id });
    }
  };

  const handleShotTypePress = (shotType: typeof ESPRESSO_SHOT_TYPES[0]) => {
    navigation.navigate('BrewMethodDetail', { 
      methodId: 'espresso',
      recipeId: `espresso-${shotType.id}`,
    });
  };

  const handleQuickAction = (action: 'dial-in' | 'improve' | 'troubleshoot' | 'log') => {
    switch (action) {
      case 'dial-in':
        if (beans.length > 0) {
          navigation.navigate('Beans', { 
            screen: 'BeanList',
            params: { showDialIn: true }
          });
        } else {
          navigation.navigate('Beans', { screen: 'BeanList' });
        }
        break;
      case 'improve':
      case 'log':
        navigation.navigate('ShotLog');
        break;
      case 'troubleshoot':
        navigation.navigate('Troubleshoot');
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
      <Text style={styles.title}>What are you brewing?</Text>

      {/* Espresso Tile - Expandable */}
      <TouchableOpacity
        onPress={toggleEspresso}
        activeOpacity={0.85}
        style={styles.espressoWrapper}
      >
        <LinearGradient
          colors={espressoMethod.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.espressoCard}
        >
          <View style={styles.glassOverlay} />
          <View style={[styles.accentGlow, { backgroundColor: espressoMethod.accentColor }]} />
          
          <View style={styles.espressoHeader}>
            <View style={[styles.espressoIconContainer, { backgroundColor: espressoMethod.accentColor + '25' }]}>
              <Text style={styles.espressoIcon}>{espressoMethod.icon}</Text>
            </View>
            <View style={styles.espressoTitleContainer}>
              <Text style={styles.espressoTitle}>{espressoMethod.name}</Text>
              <Text style={styles.espressoSubtitle}>
                {espressoExpanded ? 'Choose shot type' : 'Tap to expand'}
              </Text>
            </View>
            <View style={[styles.expandIndicator, espressoExpanded && styles.expandIndicatorActive]}>
              <Text style={styles.expandIcon}>{espressoExpanded ? '▲' : '▼'}</Text>
            </View>
          </View>
          
          {espressoExpanded && (
            <View style={styles.shotTypesContainer}>
              {ESPRESSO_SHOT_TYPES.map((type) => (
                <ShotTypeButton
                  key={type.id}
                  type={type}
                  onPress={() => handleShotTypePress(type)}
                  accentColor={espressoMethod.accentColor}
                />
              ))}
            </View>
          )}
          
          <View style={[styles.accentBar, { backgroundColor: espressoMethod.accentColor }]} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Other Brew Methods Grid */}
      <Text style={styles.sectionTitle}>Other Methods</Text>
      <View style={styles.methodsGrid}>
        {featuredMethods
          .filter(m => m.id !== 'espresso')
          .map((method) => (
            <BrewMethodGridCard
              key={method.id}
              method={method}
              onPress={() => handleBrewMethodPress(method)}
            />
          ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <QuickActionButton
          icon="☕"
          label="New Beans"
          onPress={() => handleQuickAction('dial-in')}
          color={colors.primary}
        />
        <QuickActionButton
          icon="📈"
          label="Improve"
          onPress={() => handleQuickAction('improve')}
          color="#FF9A3C"
        />
        <QuickActionButton
          icon="🔍"
          label="Troubleshoot"
          onPress={() => handleQuickAction('troubleshoot')}
          color="#81C784"
        />
        <QuickActionButton
          icon="✏️"
          label="Quick Log"
          onPress={() => handleQuickAction('log')}
          color="#7A9AB8"
        />
      </View>

      {/* Recent Brews */}
      {recentShots.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Brews</Text>
          {recentShots.map((log) => {
            const params = log.parameters as any;
            const isEspresso = log.brewMethod === 'espresso';
            return (
              <Card key={log.id} style={styles.recentCard}>
                <View style={styles.recentCardContent}>
                  <Text style={styles.recentIcon}>
                    {BREW_METHODS[log.brewMethod as BrewMethodId]?.icon || '☕'}
                  </Text>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentMethod}>
                      {BREW_METHODS[log.brewMethod as BrewMethodId]?.name || log.brewMethod}
                    </Text>
                    <Text style={styles.recentParams}>
                      {isEspresso 
                        ? `${params.dose}g → ${params.yield}ml • ${params.time}s`
                        : `${params.coffee || params.dose}g • ${params.water || params.yield}ml`
                      }
                    </Text>
                  </View>
                  {log.rating && (
                    <Text style={styles.recentRating}>
                      {`${'⭐'.repeat(log.rating)}`}
                    </Text>
                  )}
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  color: string;
}

function QuickActionButton({ icon, label, onPress, color }: QuickActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.quickActionButton}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.quickActionEmoji}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  greeting: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.base,
    marginTop: spacing.lg,
  },

  // Espresso Card
  espressoWrapper: {
    borderRadius: borderRadius.card + 4,
    ...shadows.lg,
    marginBottom: spacing.base,
  },
  espressoCard: {
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
  espressoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  espressoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  espressoIcon: {
    fontSize: 32,
  },
  espressoTitleContainer: {
    flex: 1,
    marginLeft: spacing.base,
  },
  espressoTitle: {
    ...typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  espressoSubtitle: {
    ...typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  expandIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIndicatorActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  expandIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  shotTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  shotTypeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  shotTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  shotTypeEmoji: {
    fontSize: 20,
  },
  shotTypeName: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shotTypeRatio: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },

  // Methods Grid
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Recent Section
  recentSection: {
    marginTop: spacing.sm,
  },
  recentCard: {
    marginBottom: spacing.sm,
    backgroundColor: colors.backgroundCard,
    padding: spacing.base,
  },
  recentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIcon: {
    fontSize: 24,
    marginRight: spacing.base,
  },
  recentInfo: {
    flex: 1,
  },
  recentMethod: {
    ...typography.label,
    color: colors.text,
  },
  recentParams: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: 2,
  },
  recentRating: {
    fontSize: 14,
  },
});
