import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBeanStore } from '../store';
import { Card } from '../components';
import { colors, spacing, typography, shadows, borderRadius } from '../theme';
import { Bean } from '../types';

export function BeanListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { beans, loadBeans, isLoading } = useBeanStore();
  const { showDialIn } = route.params || {};

  useEffect(() => {
    loadBeans();
  }, []);

  const renderBean = ({ item }: { item: Bean }) => (
    <Card
      onPress={() => {
        if (showDialIn) {
          // If seed bean, save it first, then go to dial-in
          if (item.isSeedData) {
            navigation.navigate('BeanEdit', { 
              beanId: item.id, 
              showDialIn: true 
            });
          } else {
            // Already a user bean, go directly to dial-in
            navigation.navigate('GuidedDialIn', { beanId: item.id });
          }
        } else {
          navigation.navigate('BeanEdit', { beanId: item.id });
        }
      }}
      style={styles.beanCard}
    >
      <Text style={styles.beanName}>{item.name}</Text>
      <Text style={styles.beanDetails}>
        {item.roastLevel} roast{item.origin ? ` • ${item.origin}` : null}
      </Text>
      {item.isSeedData && showDialIn && (
        <Text style={styles.seedHint}>Tap to save and dial in</Text>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      {beans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>☕</Text>
          <Text style={styles.emptyTitle}>No beans added yet</Text>
          <Text style={styles.emptyDescription}>
            Add your first bean to get started
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('BeanEdit', { beanId: null })}
          >
            <Text style={styles.addButtonText}>Add Bean</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('BeanEdit', { beanId: null })}
          >
            <Text style={styles.addButtonText}>+ Add Bean</Text>
          </TouchableOpacity>
          <FlatList
            data={beans}
            renderItem={renderBean}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  list: {
    padding: spacing.base,
  },
  beanCard: {
    marginBottom: spacing.base,
    backgroundColor: colors.backgroundCard,
  },
  beanName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  beanDetails: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  seedHint: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
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
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.button,
    margin: spacing.base,
    alignItems: 'center',
    ...shadows.md,
  },
  addButtonText: {
    ...typography.label,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

