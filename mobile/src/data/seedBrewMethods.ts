// Seed Data: Brew Methods
// Data-driven brew method definitions for V2 multi-method support

import { BrewMethodInfo, BrewMethodId } from '../types';

export const BREW_METHODS: Record<BrewMethodId, BrewMethodInfo> = {
  espresso: {
    id: 'espresso',
    name: 'Espresso',
    category: 'espresso',
    icon: '☕',
    description: 'Concentrated coffee brewed by forcing hot water through finely ground beans under pressure.',
    difficulty: 'intermediate',
    brewTimeRange: { min: 20, max: 35 },
    defaultRatio: 2.0,
    grindSize: 'fine',
    temperatureRange: { min: 90, max: 96 },
    equipment: ['Espresso Machine', 'Grinder', 'Tamper', 'Scale'],
    gradient: ['#3A1F1C', '#5A2D24', '#6B3D34'] as const,
    accentColor: '#E46A2E',
  },
  pour_over: {
    id: 'pour_over',
    name: 'Pour Over',
    category: 'pour_over',
    icon: '🫖',
    description: 'Manual brewing method where water is poured over coffee grounds in a filter.',
    difficulty: 'intermediate',
    brewTimeRange: { min: 150, max: 240 },
    defaultRatio: 16.0,
    grindSize: 'medium_fine',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['V60/Chemex', 'Gooseneck Kettle', 'Filter', 'Scale'],
    gradient: ['#2D3A2E', '#3D4A3E', '#4D5A4E'] as const,
    accentColor: '#7CB342',
  },
  v60: {
    id: 'v60',
    name: 'Hario V60',
    category: 'pour_over',
    icon: '🔺',
    description: 'Iconic conical dripper known for clean, bright cups with excellent clarity.',
    difficulty: 'intermediate',
    brewTimeRange: { min: 150, max: 210 },
    defaultRatio: 16.0,
    grindSize: 'medium_fine',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['V60 Dripper', 'V60 Filters', 'Gooseneck Kettle', 'Scale'],
    gradient: ['#1A2F38', '#2A3F48', '#3A4F58'] as const,
    accentColor: '#4FC3F7',
  },
  chemex: {
    id: 'chemex',
    name: 'Chemex',
    category: 'pour_over',
    icon: '⏳',
    description: 'Elegant brewer with thick filters producing exceptionally clean, sweet coffee.',
    difficulty: 'intermediate',
    brewTimeRange: { min: 210, max: 300 },
    defaultRatio: 15.0,
    grindSize: 'medium_coarse',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['Chemex', 'Chemex Filters', 'Gooseneck Kettle', 'Scale'],
    gradient: ['#3A2A1A', '#4A3A2A', '#5A4A3A'] as const,
    accentColor: '#D4A574',
  },
  filter_coffee: {
    id: 'filter_coffee',
    name: 'Filter Coffee',
    category: 'pour_over',
    icon: '☕',
    description: 'Manual flat-bottom filter brewing for consistent, balanced results.',
    difficulty: 'beginner',
    brewTimeRange: { min: 180, max: 300 },
    defaultRatio: 16.0,
    grindSize: 'medium',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['Flat-Bottom Dripper', 'Filters', 'Kettle', 'Scale'],
    gradient: ['#2A2A3A', '#3A3A4A', '#4A4A5A'] as const,
    accentColor: '#9575CD',
  },
  drip: {
    id: 'drip',
    name: 'Drip Coffee',
    category: 'drip',
    icon: '🤖',
    description: 'Automatic machine brewing for convenient, consistent coffee.',
    difficulty: 'beginner',
    brewTimeRange: { min: 240, max: 360 },
    defaultRatio: 16.0,
    grindSize: 'medium',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['Drip Coffee Maker', 'Filters'],
    gradient: ['#1A1A2A', '#2A2A3A', '#3A3A4A'] as const,
    accentColor: '#78909C',
  },
  turkish: {
    id: 'turkish',
    name: 'Turkish Coffee',
    category: 'stovetop',
    icon: '🇹🇷',
    description: 'Traditional unfiltered coffee brewed in a cezve with extra-fine grounds.',
    difficulty: 'intermediate',
    brewTimeRange: { min: 120, max: 180 },
    defaultRatio: 10.0,
    grindSize: 'extra_fine',
    temperatureRange: { min: 70, max: 90 },
    equipment: ['Cezve/Ibrik', 'Extra-Fine Grinder', 'Small Cups'],
    gradient: ['#4A1A1A', '#5A2A2A', '#6A3A3A'] as const,
    accentColor: '#EF5350',
  },
  aeropress: {
    id: 'aeropress',
    name: 'AeroPress',
    category: 'immersion',
    icon: '🔄',
    description: 'Versatile pressure-based brewer for quick, clean, concentrated coffee.',
    difficulty: 'beginner',
    brewTimeRange: { min: 60, max: 180 },
    defaultRatio: 14.0,
    grindSize: 'medium_fine',
    temperatureRange: { min: 80, max: 96 },
    equipment: ['AeroPress', 'Filters', 'Kettle', 'Scale'],
    gradient: ['#2A1A2A', '#3A2A3A', '#4A3A4A'] as const,
    accentColor: '#BA68C8',
  },
  french_press: {
    id: 'french_press',
    name: 'French Press',
    category: 'immersion',
    icon: '🫙',
    description: 'Full-immersion brewing for rich, full-bodied coffee with natural oils.',
    difficulty: 'beginner',
    brewTimeRange: { min: 240, max: 300 },
    defaultRatio: 15.0,
    grindSize: 'coarse',
    temperatureRange: { min: 92, max: 96 },
    equipment: ['French Press', 'Kettle', 'Scale'],
    gradient: ['#1A2A1A', '#2A3A2A', '#3A4A3A'] as const,
    accentColor: '#66BB6A',
  },
  indian_filter: {
    id: 'indian_filter',
    name: 'Indian Filter',
    category: 'drip',
    icon: '🇮🇳',
    description: 'Traditional South Indian gravity-drip brewing producing strong, concentrated decoction mixed with hot milk.',
    difficulty: 'beginner',
    brewTimeRange: { min: 600, max: 1200 }, // 10-20 minutes
    defaultRatio: 6.0, // Coffee:Water for decoction
    grindSize: 'fine',
    temperatureRange: { min: 95, max: 100 },
    equipment: ['South Indian Filter', 'Tumbler & Dabarah', 'Kettle'],
    gradient: ['#8B4513', '#A0522D', '#CD853F'] as const, // Warm brown/copper tones
    accentColor: '#FF8C00', // Deep orange/saffron
  },
  cold_brew: {
    id: 'cold_brew',
    name: 'Cold Brew',
    category: 'immersion',
    icon: '🧊',
    description: 'Smooth, sweet coffee steeped in cold water for 12-24 hours. Very low acidity, naturally less bitter.',
    difficulty: 'beginner',
    brewTimeRange: { min: 43200, max: 86400 }, // 12-24 hours in seconds
    defaultRatio: 6.0, // Concentrate ratio
    grindSize: 'coarse',
    temperatureRange: { min: 4, max: 20 }, // Cold to room temp
    equipment: ['Large Jar/Pitcher', 'Fine Mesh Filter', 'Paper Filter (optional)'],
    gradient: ['#1A3A4A', '#2A4A5A', '#3A5A6A'] as const, // Cool blue tones
    accentColor: '#4DD0E1', // Cyan/ice blue
  },
};

// Get brew methods by category
export function getBrewMethodsByCategory(category: BrewMethodInfo['category']): BrewMethodInfo[] {
  return Object.values(BREW_METHODS).filter(m => m.category === category);
}

// Get all brew methods as array
export function getAllBrewMethods(): BrewMethodInfo[] {
  return Object.values(BREW_METHODS);
}

// Get featured brew methods for home screen
export function getFeaturedBrewMethods(): BrewMethodInfo[] {
  // Return main methods (espresso shown separately at top)
  // 7 methods total: espresso + 6 in grid (3x2 perfect layout)
  return [
    BREW_METHODS.espresso,
    BREW_METHODS.pour_over,
    BREW_METHODS.indian_filter,
    BREW_METHODS.cold_brew,
    BREW_METHODS.turkish,
    BREW_METHODS.french_press,
    BREW_METHODS.drip,
  ];
}

// Get brew method by ID
export function getBrewMethod(id: BrewMethodId): BrewMethodInfo | undefined {
  return BREW_METHODS[id];
}

