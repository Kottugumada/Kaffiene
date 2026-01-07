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
    
    // Migration v1 -> v2: Add images column to brew_logs
    if (currentVersion < 2) {
      try {
        await db.execAsync('ALTER TABLE brew_logs ADD COLUMN images TEXT');
        console.log('Added images column to brew_logs');
      } catch (e) {
        // Column might already exist, ignore error
        console.log('Images column may already exist');
      }
    }
    
    // Set version
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
    
    console.log('Migrations completed successfully');
  }
}

