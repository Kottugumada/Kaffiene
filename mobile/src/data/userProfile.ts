// User Profile Tracking - For ML training in V2
// Tracks user preferences, successful recipes, bean preferences

export interface UserProfile {
  userId: string;
  
  // Bean preferences
  preferredOrigins: Array<{ origin: string; count: number; avgRating: number }>;
  preferredRoastLevels: Array<{ roastLevel: string; count: number; avgRating: number }>;
  preferredProcessingMethods: Array<{ method: string; count: number; avgRating: number }>;
  
  // Recipe preferences (what works for this user)
  preferredRatios: Array<{ ratio: number; count: number; avgRating: number }>;
  preferredDose: { min: number; max: number; avg: number };
  preferredTemperature: { min: number; max: number; avg: number };
  
  // Taste preferences
  tasteProfile: {
    preferredAcidity: number; // 1-5
    preferredBody: number; // 1-5
    preferredSweetness: number; // 1-5
    preferredBitterness: number; // 1-5
  };
  
  // Success patterns
  successfulShots: {
    total: number;
    avgRating: number;
    bestRatio: number;
    bestDose: number;
    bestTemperature: number;
  };
  
  // Learning data (for ML)
  shotHistory: Array<{
    beanId: string;
    parameters: any;
    rating: number;
    tasteNotes?: string;
    timestamp: number;
  }>;
  
  updatedAt: number;
}

export function createEmptyProfile(userId: string): UserProfile {
  return {
    userId,
    preferredOrigins: [],
    preferredRoastLevels: [],
    preferredProcessingMethods: [],
    preferredRatios: [],
    preferredDose: { min: 0, max: 0, avg: 0 },
    preferredTemperature: { min: 0, max: 0, avg: 0 },
    tasteProfile: {
      preferredAcidity: 3,
      preferredBody: 3,
      preferredSweetness: 3,
      preferredBitterness: 2,
    },
    successfulShots: {
      total: 0,
      avgRating: 0,
      bestRatio: 2.0,
      bestDose: 18,
      bestTemperature: 93,
    },
    shotHistory: [],
    updatedAt: Date.now(),
  };
}

