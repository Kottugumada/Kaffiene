// SQLite Schema Definitions
export const SCHEMA_VERSION = 2;

export const CREATE_TABLES = {
  beans: `
    CREATE TABLE IF NOT EXISTS beans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      roastLevel TEXT NOT NULL CHECK(roastLevel IN ('light', 'medium', 'dark', 'espresso')),
      origin TEXT,
      processingMethod TEXT,
      notes TEXT,
      isSeedData INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `,
  
  brew_logs: `
    CREATE TABLE IF NOT EXISTS brew_logs (
      id TEXT PRIMARY KEY,
      beanId TEXT NOT NULL,
      brewMethod TEXT NOT NULL,
      recipeId TEXT,
      timestamp INTEGER NOT NULL,
      parameters TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      tasteNotes TEXT,
      structuredTaste TEXT,
      equipment TEXT,
      notes TEXT,
      troubleshootingSessionId TEXT,
      images TEXT,
      FOREIGN KEY (beanId) REFERENCES beans(id) ON DELETE CASCADE,
      FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE SET NULL
    );
  `,
  
  recipes: `
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brewMethod TEXT NOT NULL,
      beanId TEXT,
      parameters TEXT NOT NULL,
      notes TEXT,
      isDefault INTEGER DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (beanId) REFERENCES beans(id) ON DELETE SET NULL
    );
  `,
  
  user_preferences: `
    CREATE TABLE IF NOT EXISTS user_preferences (
      userId TEXT PRIMARY KEY,
      coffeeWeightUnit TEXT NOT NULL DEFAULT 'grams' CHECK(coffeeWeightUnit IN ('grams', 'ounces')),
      liquidVolumeUnit TEXT NOT NULL DEFAULT 'ounces' CHECK(liquidVolumeUnit IN ('ounces', 'milliliters')),
      temperatureUnit TEXT NOT NULL DEFAULT 'celsius' CHECK(temperatureUnit IN ('celsius', 'fahrenheit')),
      defaultBrewMethod TEXT DEFAULT 'espresso',
      uiMode TEXT NOT NULL DEFAULT 'beginner' CHECK(uiMode IN ('beginner', 'enthusiast')),
      theme TEXT NOT NULL DEFAULT 'auto' CHECK(theme IN ('light', 'dark', 'auto')),
      updatedAt INTEGER NOT NULL
    );
  `,
  
  troubleshooting_sessions: `
    CREATE TABLE IF NOT EXISTS troubleshooting_sessions (
      id TEXT PRIMARY KEY,
      shotLogId TEXT,
      timestamp INTEGER NOT NULL,
      answers TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      applied INTEGER DEFAULT 0,
      outcome TEXT CHECK(outcome IN ('improved', 'same', 'worse')),
      FOREIGN KEY (shotLogId) REFERENCES brew_logs(id) ON DELETE SET NULL
    );
  `,
};

export const CREATE_INDEXES = {
  brew_logs_timestamp: `CREATE INDEX IF NOT EXISTS idx_brew_logs_timestamp ON brew_logs(timestamp DESC);`,
  brew_logs_beanId: `CREATE INDEX IF NOT EXISTS idx_brew_logs_beanId ON brew_logs(beanId);`,
  beans_name: `CREATE INDEX IF NOT EXISTS idx_beans_name ON beans(name);`,
  recipes_brewMethod: `CREATE INDEX IF NOT EXISTS idx_recipes_brewMethod ON recipes(brewMethod);`,
};

