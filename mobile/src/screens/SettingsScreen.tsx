import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useUserPreferencesStore } from '../store';
import {
  CoffeeWeightUnit,
  LiquidVolumeUnit,
  TemperatureUnit,
} from '../types';

export function SettingsScreen() {
  const navigation = useNavigation();
  const { preferences, loadPreferences, updatePreferences } =
    useUserPreferencesStore();

  const [coffeeWeightUnit, setCoffeeWeightUnit] = useState<CoffeeWeightUnit>('grams');
  const [liquidVolumeUnit, setLiquidVolumeUnit] = useState<LiquidVolumeUnit>('milliliters');
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences) {
      setCoffeeWeightUnit(preferences.coffeeWeightUnit);
      setLiquidVolumeUnit(preferences.liquidVolumeUnit);
      setTemperatureUnit(preferences.temperatureUnit);
    }
  }, [preferences]);

  const handleSave = async () => {
    await updatePreferences({
      coffeeWeightUnit,
      liquidVolumeUnit,
      temperatureUnit,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred units for measurements
        </Text>

        {/* Coffee Weight Unit */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Coffee Weight</Text>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitOption,
                coffeeWeightUnit === 'grams' && styles.unitOptionActive,
              ]}
              onPress={() => setCoffeeWeightUnit('grams')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  coffeeWeightUnit === 'grams' && styles.unitOptionTextActive,
                ]}
              >
                Grams (g)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitOption,
                coffeeWeightUnit === 'ounces' && styles.unitOptionActive,
              ]}
              onPress={() => setCoffeeWeightUnit('ounces')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  coffeeWeightUnit === 'ounces' && styles.unitOptionTextActive,
                ]}
              >
                Ounces (oz)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Liquid Volume Unit */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Liquid Volume</Text>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitOption,
                liquidVolumeUnit === 'milliliters' && styles.unitOptionActive,
              ]}
              onPress={() => setLiquidVolumeUnit('milliliters')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  liquidVolumeUnit === 'milliliters' && styles.unitOptionTextActive,
                ]}
              >
                Milliliters (ml)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitOption,
                liquidVolumeUnit === 'ounces' && styles.unitOptionActive,
              ]}
              onPress={() => setLiquidVolumeUnit('ounces')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  liquidVolumeUnit === 'ounces' && styles.unitOptionTextActive,
                ]}
              >
                Ounces (oz)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Temperature Unit */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Temperature</Text>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitOption,
                temperatureUnit === 'celsius' && styles.unitOptionActive,
              ]}
              onPress={() => setTemperatureUnit('celsius')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  temperatureUnit === 'celsius' && styles.unitOptionTextActive,
                ]}
              >
                Celsius (°C)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitOption,
                temperatureUnit === 'fahrenheit' && styles.unitOptionActive,
              ]}
              onPress={() => setTemperatureUnit('fahrenheit')}
            >
              <Text
                style={[
                  styles.unitOptionText,
                  temperatureUnit === 'fahrenheit' && styles.unitOptionTextActive,
                ]}
              >
                Fahrenheit (°F)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <Button
        title="Save Preferences"
        onPress={handleSave}
        fullWidth
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  section: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.base,
  },
  settingRow: {
    marginBottom: spacing.lg,
  },
  settingLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.input,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
  },
  unitOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  unitOptionText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  unitOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  saveButton: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
});
