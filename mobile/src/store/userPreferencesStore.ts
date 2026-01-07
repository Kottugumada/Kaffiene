import { create } from 'zustand';
import { UserPreferences } from '../types';
import { userPreferencesRepository } from '../repositories';

interface UserPreferencesState {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  loadPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

export const useUserPreferencesStore = create<UserPreferencesState>((set, get) => ({
  preferences: null,
  isLoading: false,
  error: null,

  loadPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const preferences = await userPreferencesRepository.get();
      set({ preferences, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updatePreferences: async (prefs) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await userPreferencesRepository.update(prefs);
      set({ preferences: updated, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

