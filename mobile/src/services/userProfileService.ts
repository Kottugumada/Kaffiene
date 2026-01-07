// Service to build and update user profile from shot history
import { UserProfile, createEmptyProfile } from '../data/userProfile';
import { BrewLog, Bean } from '../types';
import { brewLogRepository } from '../repositories';
import { beanRepository } from '../repositories';

export async function buildUserProfile(userId: string, logs: BrewLog[], beans: Bean[]): Promise<UserProfile> {
  const profile = createEmptyProfile(userId);
  
  if (logs.length === 0) {
    return profile;
  }

  // Build origin preferences
  const originMap = new Map<string, { count: number; totalRating: number }>();
  const roastMap = new Map<string, { count: number; totalRating: number }>();
  const processingMap = new Map<string, { count: number; totalRating: number }>();
  const ratioMap = new Map<number, { count: number; totalRating: number }>();
  
  const doses: number[] = [];
  const temperatures: number[] = [];
  const successfulShots: BrewLog[] = [];

  for (const log of logs) {
    const bean = beans.find((b) => b.id === log.beanId);
    if (!bean) continue;

    const params = log.parameters as any;
    const rating = log.rating || 0;

    // Track origins
    if (bean.origin) {
      const key = bean.origin.toLowerCase();
      const existing = originMap.get(key) || { count: 0, totalRating: 0 };
      originMap.set(key, {
        count: existing.count + 1,
        totalRating: existing.totalRating + rating,
      });
    }

    // Track roast levels
    const roastKey = bean.roastLevel;
    const roastExisting = roastMap.get(roastKey) || { count: 0, totalRating: 0 };
    roastMap.set(roastKey, {
      count: roastExisting.count + 1,
      totalRating: roastExisting.totalRating + rating,
    });

    // Track processing methods
    if (bean.processingMethod) {
      const procKey = bean.processingMethod.toLowerCase();
      const procExisting = processingMap.get(procKey) || { count: 0, totalRating: 0 };
      processingMap.set(procKey, {
        count: procExisting.count + 1,
        totalRating: procExisting.totalRating + rating,
      });
    }

    // Track ratios
    if (params.ratio) {
      const ratioRounded = Math.round(params.ratio * 10) / 10;
      const ratioExisting = ratioMap.get(ratioRounded) || { count: 0, totalRating: 0 };
      ratioMap.set(ratioRounded, {
        count: ratioExisting.count + 1,
        totalRating: ratioExisting.totalRating + rating,
      });
    }

    // Track doses and temperatures
    if (params.dose) doses.push(params.dose);
    if (params.temperature) temperatures.push(params.temperature);

    // Track successful shots (rating >= 4)
    if (rating >= 4) {
      successfulShots.push(log);
    }

    // Add to shot history
    profile.shotHistory.push({
      beanId: bean.id,
      parameters: params,
      rating,
      tasteNotes: log.tasteNotes,
      timestamp: log.timestamp,
    });
  }

  // Convert maps to arrays
  profile.preferredOrigins = Array.from(originMap.entries())
    .map(([origin, data]) => ({
      origin,
      count: data.count,
      avgRating: data.totalRating / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  profile.preferredRoastLevels = Array.from(roastMap.entries())
    .map(([roastLevel, data]) => ({
      roastLevel,
      count: data.count,
      avgRating: data.totalRating / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  profile.preferredProcessingMethods = Array.from(processingMap.entries())
    .map(([method, data]) => ({
      method,
      count: data.count,
      avgRating: data.totalRating / data.count,
    }))
    .sort((a, b) => b.count - a.count);

  profile.preferredRatios = Array.from(ratioMap.entries())
    .map(([ratio, data]) => ({
      ratio,
      count: data.count,
      avgRating: data.totalRating / data.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating);

  // Calculate dose and temperature preferences
  if (doses.length > 0) {
    profile.preferredDose = {
      min: Math.min(...doses),
      max: Math.max(...doses),
      avg: doses.reduce((a, b) => a + b, 0) / doses.length,
    };
  }

  if (temperatures.length > 0) {
    profile.preferredTemperature = {
      min: Math.min(...temperatures),
      max: Math.max(...temperatures),
      avg: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
    };
  }

  // Calculate successful shots stats
  if (successfulShots.length > 0) {
    const successfulRatings = successfulShots.map((s) => s.rating || 0);
    const bestParams = successfulShots[0]?.parameters as any;
    profile.successfulShots = {
      total: successfulShots.length,
      avgRating: successfulRatings.reduce((a, b) => a + b, 0) / successfulRatings.length,
      bestRatio: bestParams?.ratio || 2.0,
      bestDose: bestParams?.dose || 18,
      bestTemperature: bestParams?.temperature || 93,
    };
  }

  profile.updatedAt = Date.now();
  return profile;
}

