import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Input, Button, StarRating, Slider } from '../components';
import { useBrewLogStore, useBeanStore, useUserPreferencesStore } from '../store';
import { colors, spacing, typography } from '../theme';
import { EspressoParameters, BrewMethod } from '../types';
import { calculateYield, calculateRatio } from '../utils/units';
import { getRecommendedRatio } from '../services/ratioService';
import { suggestParametersFromRatio } from '../services/recommendationService';

export function ShotLogScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { beans, loadBeans } = useBeanStore();
  const { addLog } = useBrewLogStore();
  const { preferences, loadPreferences } = useUserPreferencesStore();

  const [selectedBeanId, setSelectedBeanId] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<string>('espresso_standard');
  const [dose, setDose] = useState('18');
  const [yieldAmount, setYieldAmount] = useState('36');
  const [time, setTime] = useState('28');
  const [grind, setGrind] = useState(50);
  const [temperature, setTemperature] = useState('92');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadBeans();
    loadPreferences();
  }, []);

  const selectedBean = beans.find((b) => b.id === selectedBeanId);
  const ratioDef = getRecommendedRatio(
    selectedBean?.roastLevel || 'medium',
    'espresso'
  );

  const handleDoseChange = (value: string) => {
    setDose(value);
    const doseNum = parseFloat(value) || 0;
    const ratio = parseFloat(selectedRatio.split('_')[1] === 'standard' ? '2' : selectedRatio.split('_')[1] === 'ristretto' ? '1.5' : '2.5');
    if (doseNum > 0) {
      const calculatedYield = calculateYield(doseNum, ratio);
      setYieldAmount(calculatedYield.toFixed(1));
    }
  };

  const handleSave = async () => {
    if (!selectedBeanId) {
      return;
    }

    const parameters: EspressoParameters = {
      dose: parseFloat(dose) || 0,
      yield: parseFloat(yieldAmount) || 0,
      time: parseFloat(time) || 0,
      grind,
      temperature: parseFloat(temperature) || 92,
      ratio: calculateRatio(parseFloat(dose) || 0, 'grams', parseFloat(yieldAmount) || 0, 'ml'),
    };

    try {
      await addLog({
        beanId: selectedBeanId,
        brewMethod: 'espresso' as BrewMethod,
        parameters,
        rating: rating > 0 ? rating : undefined,
        tasteNotes: notes || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving shot:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Bean *</Text>
        <View style={styles.beanSelector}>
          {beans.map((bean) => (
            <TouchableOpacity
              key={bean.id}
              style={[
                styles.beanOption,
                selectedBeanId === bean.id && styles.beanOptionSelected,
              ]}
              onPress={() => setSelectedBeanId(bean.id)}
            >
              <Text
                style={[
                  styles.beanOptionText,
                  selectedBeanId === bean.id && styles.beanOptionTextSelected,
                ]}
              >
                {bean.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Ratio</Text>
        <View style={styles.ratioSelector}>
          <TouchableOpacity
            style={[
              styles.ratioOption,
              selectedRatio === 'espresso_ristretto' && styles.ratioOptionSelected,
            ]}
            onPress={() => setSelectedRatio('espresso_ristretto')}
          >
            <Text
              style={[
                styles.ratioText,
                selectedRatio === 'espresso_ristretto' && styles.ratioTextSelected,
              ]}
            >
              Ristretto{'\n'}1:1.5
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.ratioOption,
              selectedRatio === 'espresso_standard' && styles.ratioOptionSelected,
            ]}
            onPress={() => setSelectedRatio('espresso_standard')}
          >
            <Text
              style={[
                styles.ratioText,
                selectedRatio === 'espresso_standard' && styles.ratioTextSelected,
              ]}
            >
              Standard{'\n'}1:2
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.ratioOption,
              selectedRatio === 'espresso_lungo' && styles.ratioOptionSelected,
            ]}
            onPress={() => setSelectedRatio('espresso_lungo')}
          >
            <Text
              style={[
                styles.ratioText,
                selectedRatio === 'espresso_lungo' && styles.ratioTextSelected,
              ]}
            >
              Lungo{'\n'}1:2.5
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Input
        label="Dose"
        value={dose}
        onChangeText={handleDoseChange}
        keyboardType="decimal-pad"
        unit="g"
      />

      <Input
        label="Yield"
        value={yieldAmount}
        onChangeText={setYieldAmount}
        keyboardType="decimal-pad"
        unit="ml"
      />

      <Input
        label="Time"
        value={time}
        onChangeText={setTime}
        keyboardType="decimal-pad"
        unit="s"
      />

      <Slider
        label="Grind Size"
        value={grind}
        onValueChange={setGrind}
        minimumValue={0}
        maximumValue={100}
        leftLabel="Fine"
        rightLabel="Coarse"
      />

      <Input
        label="Temperature"
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="decimal-pad"
        unit="°C"
      />

      <View style={styles.section}>
        <Text style={styles.label}>Rating</Text>
        <StarRating rating={rating} onRatingChange={setRating} />
      </View>

      <Input
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="How did it taste?"
        multiline
      />

      <Button title="Save Shot" onPress={handleSave} fullWidth />
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
  beanSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  beanOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  beanOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  beanOptionText: {
    ...typography.body,
    color: colors.text,
  },
  beanOptionTextSelected: {
    color: '#FFFFFF',
  },
  ratioSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratioOption: {
    flex: 1,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  ratioOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ratioText: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'center',
  },
  ratioTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

