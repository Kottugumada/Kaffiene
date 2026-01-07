import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Input, Button } from '../components';
import { useBeanStore } from '../store';
import { colors, spacing, typography } from '../theme';
import { Bean, RoastLevel } from '../types';

export function BeanEditScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { beanId } = route.params || {};
  const { beans, addBean, updateBean, loadBeans } = useBeanStore();

  const [name, setName] = useState('');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('medium');
  const [origin, setOrigin] = useState('');
  const [processingMethod, setProcessingMethod] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (beanId) {
      const bean = beans.find((b) => b.id === beanId);
      if (bean) {
        setName(bean.name);
        setRoastLevel(bean.roastLevel);
        setOrigin(bean.origin || '');
        setProcessingMethod(bean.processingMethod || '');
        setNotes(bean.notes || '');
      }
    }
  }, [beanId, beans]);

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      if (beanId) {
        const bean = beans.find((b) => b.id === beanId);
        if (bean) {
          await updateBean({
            ...bean,
            name,
            roastLevel,
            origin: origin || undefined,
            processingMethod: processingMethod || undefined,
            notes: notes || undefined,
          });
        }
      } else {
        await addBean({
          name,
          roastLevel,
          origin: origin || undefined,
          processingMethod: processingMethod || undefined,
          notes: notes || undefined,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving bean:', error);
    }
  };

  const roastLevels: RoastLevel[] = ['light', 'medium', 'dark', 'espresso'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="Bean Name *"
        value={name}
        onChangeText={setName}
        placeholder="e.g., Ethiopian Yirgacheffe"
      />

      <View style={styles.section}>
        <Text style={styles.label}>Roast Level *</Text>
        <View style={styles.options}>
          {roastLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.option,
                roastLevel === level && styles.optionSelected,
              ]}
              onPress={() => setRoastLevel(level)}
            >
              <Text
                style={[
                  styles.optionText,
                  roastLevel === level && styles.optionTextSelected,
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="Origin (optional)"
        value={origin}
        onChangeText={setOrigin}
        placeholder="e.g., Ethiopia"
      />

      <Input
        label="Processing Method (optional)"
        value={processingMethod}
        onChangeText={setProcessingMethod}
        placeholder="e.g., Washed, Natural"
      />

      <Input
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="Any additional notes..."
        multiline
      />

      <Button title="Save Bean" onPress={handleSave} fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    minWidth: 80,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});

