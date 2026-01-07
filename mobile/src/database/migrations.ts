import * as SQLite from 'expo-sqlite';
import { SCHEMA_VERSION, CREATE_TABLES, CREATE_INDEXES } from './schema';

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  // Get current version
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version || 0;

  if (currentVersion < SCHEMA_VERSION) {
    console.log(`Running migrations from version ${currentVersion} to ${SCHEMA_VERSION}`);
    
    // Create tables
    await db.execAsync(CREATE_TABLES.beans);
    await db.execAsync(CREATE_TABLES.brew_logs);
    await db.execAsync(CREATE_TABLES.recipes);
    await db.execAsync(CREATE_TABLES.user_preferences);
    await db.execAsync(CREATE_TABLES.troubleshooting_sessions);
    
    // Create indexes
    await db.execAsync(CREATE_INDEXES.brew_logs_timestamp);
    await db.execAsync(CREATE_INDEXES.brew_logs_beanId);
    await db.execAsync(CREATE_INDEXES.beans_name);
    await db.execAsync(CREATE_INDEXES.recipes_brewMethod);
    
    // Set version
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
    
    console.log('Migrations completed successfully');
  }
}

