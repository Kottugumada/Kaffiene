import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useBrewLogStore } from '../store';
import { Card } from '../components';
import { colors, spacing, typography } from '../theme';

export function ProgressScreen() {
  const { logs, loadLogs, isLoading } = useBrewLogStore();

  useEffect(() => {
    loadLogs(20);
  }, []);

  const bestShot = logs
    .filter((log) => log.rating === 5)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  const renderLog = ({ item }: { item: any }) => {
    const params = item.parameters as any;
    return (
      <Card style={styles.logCard}>
        <Text style={styles.logText}>
          {params.dose}g → {params.yield}ml | {params.time}s
        </Text>
        {item.rating && (
          <Text style={styles.logRating}>
            {`${'⭐'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}`}
          </Text>
        )}
        <Text style={styles.logDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {bestShot && (
        <Card style={styles.bestShotCard}>
          <Text style={styles.bestShotLabel}>⭐ Best Shot</Text>
          <Text style={styles.bestShotText}>
            {bestShot.parameters.dose}g → {bestShot.parameters.yield}ml |{' '}
            {bestShot.parameters.time}s
          </Text>
          {bestShot.tasteNotes && (
            <Text style={styles.bestShotNotes}>{bestShot.tasteNotes}</Text>
          )}
        </Card>
      )}

      <Text style={styles.sectionTitle}>Recent Shots</Text>
      {logs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☕</Text>
          <Text style={styles.emptyTitle}>No shots logged yet</Text>
          <Text style={styles.emptyDescription}>
            Start by logging your first shot to track your progress
          </Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLog}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
  bestShotCard: {
    margin: spacing.base,
    backgroundColor: colors.accentLight,
  },
  bestShotLabel: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  bestShotText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bestShotNotes: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.base,
  },
  logCard: {
    marginBottom: spacing.sm,
  },
  logText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  logRating: {
    ...typography.bodySmall,
    color: colors.star,
    marginBottom: spacing.xs,
  },
  logDate: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.base,
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
});

