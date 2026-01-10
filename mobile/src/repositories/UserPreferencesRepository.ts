import { getDatabase } from '../database/db';
import { UserPreferences } from '../types';

const DEFAULT_USER_ID = 'default_user';

export class UserPreferencesRepository {
  async get(): Promise<UserPreferences> {
    const db = await getDatabase();
    let result = await db.getFirstAsync<UserPreferences>(
      'SELECT * FROM user_preferences WHERE userId = ?',
      [DEFAULT_USER_ID]
    );

    if (!result) {
      // Create default preferences
      const defaultPrefs: UserPreferences = {
        userId: DEFAULT_USER_ID,
        coffeeWeightUnit: 'grams',
        liquidVolumeUnit: 'milliliters',
        temperatureUnit: 'celsius',
        defaultBrewMethod: 'espresso',
        uiMode: 'beginner',
        theme: 'auto',
        updatedAt: Date.now(),
      };
      await this.create(defaultPrefs);
      return defaultPrefs;
    }

    return result;
  }

  async create(prefs: UserPreferences): Promise<UserPreferences> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO user_preferences (userId, coffeeWeightUnit, liquidVolumeUnit, temperatureUnit, defaultBrewMethod, uiMode, theme, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prefs.userId,
        prefs.coffeeWeightUnit,
        prefs.liquidVolumeUnit,
        prefs.temperatureUnit,
        prefs.defaultBrewMethod,
        prefs.uiMode,
        prefs.theme,
        prefs.updatedAt,
      ]
    );
    return prefs;
  }

  async update(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const db = await getDatabase();
    const current = await this.get();
    const updated: UserPreferences = {
      ...current,
      ...prefs,
      updatedAt: Date.now(),
    };

    await db.runAsync(
      `UPDATE user_preferences SET coffeeWeightUnit = ?, liquidVolumeUnit = ?, temperatureUnit = ?, defaultBrewMethod = ?, uiMode = ?, theme = ?, updatedAt = ?
       WHERE userId = ?`,
      [
        updated.coffeeWeightUnit,
        updated.liquidVolumeUnit,
        updated.temperatureUnit,
        updated.defaultBrewMethod,
        updated.uiMode,
        updated.theme,
        updated.updatedAt,
        updated.userId,
      ]
    );

    return updated;
  }
}

export const userPreferencesRepository = new UserPreferencesRepository();

