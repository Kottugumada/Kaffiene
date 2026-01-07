import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { getDatabase } from './src/database/db';
import { useUserPreferencesStore } from './src/store';
import { loadSeedBeans } from './src/services/seedDataService';

export default function App() {
  const { loadPreferences } = useUserPreferencesStore();

  useEffect(() => {
    // Initialize database and load seed data
    getDatabase().then(async () => {
      loadPreferences();
      // Load seed beans on first launch
      await loadSeedBeans();
    });
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
