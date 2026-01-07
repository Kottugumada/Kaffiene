import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { useBrewLogStore, useBeanStore, useUserPreferencesStore } from '../store';

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

      <Card
        onPress={() => {
          // If beans exist, show selection. Otherwise, go to add bean first
          if (beans.length > 0) {
            navigation.navigate('Beans', { 
              screen: 'BeanList',
              params: { showDialIn: true }
            });
          } else {
            // No beans yet, go to add bean first
            navigation.navigate('Beans', { screen: 'BeanList' });
          }
        }}
        style={styles.intentCard}
      >
        <Text style={styles.intentIcon}>☕</Text>
        <Text style={styles.intentTitle}>New Beans</Text>
        <Text style={styles.intentDescription}>Dial in a new coffee</Text>
      </Card>

      <Card
        onPress={() => navigation.navigate('ShotLog')}
        style={styles.intentCard}
      >
        <Text style={styles.intentIcon}>📈</Text>
        <Text style={styles.intentTitle}>Improve Shots</Text>
        <Text style={styles.intentDescription}>Get better with guidance</Text>
      </Card>

      <Card
        onPress={() => navigation.navigate('Troubleshoot')}
        style={styles.intentCard}
      >
        <Text style={styles.intentIcon}>🔍</Text>
        <Text style={styles.intentTitle}>Troubleshoot</Text>
        <Text style={styles.intentDescription}>Diagnose your last shot</Text>
      </Card>

      <Card
        onPress={() => navigation.navigate('ShotLog')}
        style={styles.intentCard}
      >
        <Text style={styles.intentIcon}>✏️</Text>
        <Text style={styles.intentTitle}>Quick Log</Text>
        <Text style={styles.intentDescription}>Just record a shot</Text>
      </Card>

      {recentShots.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Shots</Text>
          {recentShots.map((log) => (
            <Card key={log.id} style={styles.shotCard}>
              <Text style={styles.shotText}>
                {log.parameters.dose}g → {log.parameters.yield}ml | {log.parameters.time}s
              </Text>
              {log.rating && (
                <Text style={styles.shotRating}>
                  {'⭐'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}
                </Text>
              )}
            </Card>
          ))}
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
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  intentCard: {
    marginBottom: spacing.base,
    alignItems: 'center',
    padding: spacing.xl,
    ...shadows.md,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.card,
    borderWidth: 0,
  },
  intentIcon: {
    fontSize: 56,
    marginBottom: spacing.base,
  },
  intentTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  intentDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    marginTop: spacing.xxxl,
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

