import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { useBrewLogStore, useBeanStore, useUserPreferencesStore } from '../store';

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  gradient: readonly [string, string, ...string[]];
  accentColor: string;
}

function ActionCard({ icon, title, description, onPress, gradient, accentColor }: ActionCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85}
      style={styles.cardWrapper}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionCard}
      >
        {/* Glass overlay effect */}
        <View style={styles.glassOverlay} />
        
        {/* Accent glow */}
        <View style={[styles.accentGlow, { backgroundColor: accentColor }]} />
        
        {/* Content */}
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: accentColor + '25' }]}>
            <Text style={styles.intentIcon}>{icon}</Text>
          </View>
          <Text style={styles.intentTitle}>{title}</Text>
          <Text style={styles.intentDescription}>{description}</Text>
        </View>
        
        {/* Bottom accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { loadLogs, logs } = useBrewLogStore();
  const { loadPreferences } = useUserPreferencesStore();
  const { beans, loadBeans } = useBeanStore();

  useEffect(() => {
    loadPreferences();
    loadLogs(5);
    loadBeans();
  }, []);

  const recentShots = logs.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>What would you like to do?</Text>

      <ActionCard
        icon="☕"
        title="New Beans"
        description="Dial in a new coffee"
        gradient={['#3A1F1C', '#5A2D24', '#6B3D34']}
        accentColor={colors.primary}
        onPress={() => {
          if (beans.length > 0) {
            navigation.navigate('Beans', { 
              screen: 'BeanList',
              params: { showDialIn: true }
            });
          } else {
            navigation.navigate('Beans', { screen: 'BeanList' });
          }
        }}
      />

      <ActionCard
        icon="📈"
        title="Improve Shots"
        description="Get better with guidance"
        gradient={['#2A1412', '#3A1F1C', '#4A2C20']}
        accentColor="#FF9A3C"
        onPress={() => navigation.navigate('ShotLog')}
      />

      <ActionCard
        icon="🔍"
        title="Troubleshoot"
        description="Diagnose your last shot"
        gradient={['#1A1612', '#2A1412', '#3A1F1C']}
        accentColor="#81C784"
        onPress={() => navigation.navigate('Troubleshoot')}
      />

      <ActionCard
        icon="✏️"
        title="Quick Log"
        description="Just record a shot"
        gradient={['#2E1A0E', '#3A1F1C', '#4A2520']}
        accentColor="#7A9AB8"
        onPress={() => navigation.navigate('ShotLog')}
      />

      {recentShots.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Shots</Text>
          {recentShots.map((log) => {
            const params = log.parameters as any;
            return (
              <Card key={log.id} style={styles.shotCard}>
                <Text style={styles.shotText}>
                  {params.dose}g → {params.yield}ml | {params.time}s
                </Text>
                {log.rating && (
                  <Text style={styles.shotRating}>
                    {`${'⭐'.repeat(log.rating)}${'☆'.repeat(5 - log.rating)}`}
                  </Text>
                )}
              </Card>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
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
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  cardWrapper: {
    marginBottom: spacing.base,
    borderRadius: borderRadius.card + 4,
    ...shadows.lg,
  },
  actionCard: {
    borderRadius: borderRadius.card + 4,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: borderRadius.card + 4,
  },
  accentGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.15,
  },
  cardContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  intentIcon: {
    fontSize: 40,
  },
  intentTitle: {
    ...typography.h3,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  intentDescription: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  recentSection: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
    fontWeight: '700',
  },
  shotCard: {
    marginBottom: spacing.base,
    backgroundColor: colors.backgroundCard,
  },
  shotText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  shotRating: {
    ...typography.bodyLarge,
    color: colors.starFilled,
    fontSize: 18,
  },
});
