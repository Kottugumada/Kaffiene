import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipeCard, Button } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { getBrewMethod, getRecipesByMethod, getDefaultRecipe } from '../data';
import { BrewMethodId, BrewRecipe } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RouteParams = {
  BrewMethodDetail: {
    methodId: BrewMethodId;
    recipeId?: string;
  };
};

export function BrewMethodDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'BrewMethodDetail'>>();
  const { methodId, recipeId } = route.params;

  const method = useMemo(() => getBrewMethod(methodId), [methodId]);
  const recipes = useMemo(() => getRecipesByMethod(methodId), [methodId]);
  const defaultRecipe = useMemo(() => getDefaultRecipe(methodId), [methodId]);

  if (!method) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Brew method not found</Text>
      </View>
    );
  }

  const handleRecipeSelect = (recipe: BrewRecipe) => {
    navigation.navigate('GuidedBrew', { 
      methodId: method.id,
      recipeId: recipe.id,
    });
  };

  const handleStartBrewing = () => {
    const recipe = recipeId 
      ? recipes.find(r => r.id === recipeId) || defaultRecipe
      : defaultRecipe;
    
    if (recipe) {
      navigation.navigate('GuidedBrew', {
        methodId: method.id,
        recipeId: recipe.id,
      });
    }
  };

  const grindSizeLabel = formatGrindSize(method.grindSize);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={method.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroGlassOverlay} />
          <View style={[styles.heroGlow, { backgroundColor: method.accentColor }]} />
          
          <View style={[styles.heroIconContainer, { backgroundColor: method.accentColor + '30' }]}>
            <Text style={styles.heroIcon}>{method.icon}</Text>
          </View>
          
          <Text style={styles.heroTitle}>{method.name}</Text>
          <Text style={styles.heroDescription}>{method.description}</Text>
          
          <View style={[styles.heroAccentBar, { backgroundColor: method.accentColor }]} />
        </LinearGradient>

        {/* Method Info Cards */}
        <View style={styles.infoCards}>
          <InfoCard
            icon="⏱"
            label="Brew Time"
            value={formatBrewTime(method.brewTimeRange)}
            accentColor={method.accentColor}
          />
          <InfoCard
            icon="⚖️"
            label="Ratio"
            value={`1:${method.defaultRatio}`}
            accentColor={method.accentColor}
          />
          <InfoCard
            icon="🌡"
            label="Temperature"
            value={`${method.temperatureRange.min}-${method.temperatureRange.max}°C`}
            accentColor={method.accentColor}
          />
          <InfoCard
            icon="🫘"
            label="Grind"
            value={grindSizeLabel}
            accentColor={method.accentColor}
          />
        </View>

        {/* Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {method.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <View style={[styles.equipmentBullet, { backgroundColor: method.accentColor }]} />
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recipes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipes</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a recipe to start brewing
          </Text>
          
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => handleRecipeSelect(recipe)}
              accentColor={method.accentColor}
              isSelected={recipe.id === recipeId}
            />
          ))}
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={['transparent', colors.backgroundSecondary]}
          style={styles.bottomGradient}
        />
        <View style={styles.bottomContent}>
          <TouchableOpacity
            onPress={handleStartBrewing}
            activeOpacity={0.9}
            style={[styles.startButton, { backgroundColor: method.accentColor }]}
          >
            <Text style={styles.startButtonText}>Start Brewing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface InfoCardProps {
  icon: string;
  label: string;
  value: string;
  accentColor: string;
}

function InfoCard({ icon, label, value, accentColor }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoCardIcon, { backgroundColor: accentColor + '15' }]}>
        <Text style={styles.infoCardEmoji}>{icon}</Text>
      </View>
      <Text style={styles.infoCardValue}>{value}</Text>
      <Text style={styles.infoCardLabel}>{label}</Text>
    </View>
  );
}

function formatBrewTime(range: { min: number; max: number }): string {
  const minMins = Math.floor(range.min / 60);
  const maxMins = Math.ceil(range.max / 60);
  
  if (range.max < 60) {
    return `${range.min}-${range.max}s`;
  }
  
  if (minMins === maxMins) {
    return `~${minMins}m`;
  }
  return `${minMins}-${maxMins}m`;
}

function formatGrindSize(grind: string): string {
  const labels: Record<string, string> = {
    extra_fine: 'Extra Fine',
    fine: 'Fine',
    medium_fine: 'Medium-Fine',
    medium: 'Medium',
    medium_coarse: 'Medium-Coarse',
    coarse: 'Coarse',
  };
  return labels[grind] || grind;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxxl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Hero
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroIcon: {
    fontSize: 52,
  },
  heroTitle: {
    ...typography.h1,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroDescription: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  heroAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // Info Cards
  infoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenPadding,
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  infoCard: {
    width: '48%',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    marginBottom: spacing.sm,
    marginHorizontal: '1%',
    alignItems: 'center',
    ...shadows.md,
  },
  infoCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  infoCardEmoji: {
    fontSize: 22,
  },
  infoCardValue: {
    ...typography.label,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoCardLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },

  // Equipment
  equipmentList: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    padding: spacing.base,
    ...shadows.sm,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  equipmentBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.base,
  },
  equipmentText: {
    ...typography.body,
    color: colors.text,
  },

  // Bottom
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    height: 40,
  },
  bottomContent: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  startButton: {
    height: spacing.buttonHeight,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  startButtonText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
});

