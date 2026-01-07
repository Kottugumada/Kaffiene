// Kaffiene Brand Color Palette
// Rich coffee browns with vibrant crema orange accents
// Designed for Apple-native feel with glass effects

export const colors = {
  // ☕ Primary Colors (From Logo)
  primary: '#E46A2E', // Crema Orange - Signature Accent (CTA buttons, highlights)
  primaryLight: '#FF9A3C', // Amber Glow (progress bars, success states)
  primaryDark: '#C85622', // Pressed state
  primaryGradient: ['#E46A2E', '#FF9A3C'],
  
  // Espresso Browns
  espresso: '#3A1F1C', // Espresso Brown - Deep, rich
  roasted: '#5A2D24', // Roasted Cocoa - Slightly warmer
  darkEspresso: '#2A1412', // Dark mode background
  
  // Secondary - Roasted Cocoa
  secondary: '#5A2D24',
  secondaryLight: '#6B3D34',
  secondaryDark: '#4A2520',
  
  // Background colors - Light Mode (Soft, warm neutrals)
  background: '#FAF7F5', // Main background
  backgroundSecondary: '#F5F1EE', // Soft Bone White
  backgroundTertiary: '#E6DDD8', // Dividers
  backgroundCard: '#FFFFFF',
  
  // Text colors - Rich, readable
  text: '#3A1F1C', // Espresso Brown
  textSecondary: '#5A2D24', // Roasted Cocoa
  textTertiary: '#A38F87', // Muted labels
  textInverse: '#FFFFFF',
  
  // Accent colors - Crema Orange tones
  accent: '#E46A2E', // Crema Orange
  accentLight: '#FF9A3C', // Amber Glow
  accentDark: '#C85622',
  accentSecondary: '#FF9A3C',
  
  // Status colors
  success: '#4CAF50', // Green for success
  successLight: '#81C784',
  warning: '#FF9A3C', // Amber Glow
  warningLight: '#FFB366',
  error: '#C23A2B', // Destructive red
  errorLight: '#E05545',
  info: '#5A7A9A',
  infoLight: '#7A9AB8',
  
  // Border colors
  border: '#E6DDD8',
  borderLight: '#F5F1EE',
  borderDark: '#D6C8C2',
  
  // Rating/Stars - Golden amber
  star: '#FF9A3C',
  starFilled: '#E46A2E',
  starEmpty: '#E6DDD8',
  
  // Shadows - Warm
  shadow: 'rgba(58, 31, 28, 0.12)',
  shadowLight: 'rgba(58, 31, 28, 0.06)',
  shadowDark: 'rgba(58, 31, 28, 0.18)',
  
  // Glass effects (for future use)
  glassBackground: 'rgba(255, 255, 255, 0.15)',
  glassBorder: 'rgba(255, 255, 255, 0.20)',
  glassHighlight: 'rgba(228, 106, 46, 0.10)', // Crema tint
};

// Dark Mode - Recommended Default
export const darkColors = {
  // Primary - Crema Orange (vibrant on dark)
  primary: '#E46A2E',
  primaryLight: '#FF9A3C',
  primaryDark: '#C85622',
  primaryGradient: ['#E46A2E', '#FF9A3C'],
  
  // Espresso Browns
  espresso: '#3A1F1C',
  roasted: '#5A2D24',
  darkEspresso: '#2A1412',
  
  // Secondary
  secondary: '#5A2D24',
  secondaryLight: '#6B3D34',
  secondaryDark: '#4A2520',
  
  // Background colors - Deep, warm darks
  background: '#2A1412', // Main dark background
  backgroundSecondary: '#3A1F1C', // Elevated surfaces (with blur)
  backgroundTertiary: '#4A2C20',
  backgroundCard: '#3A1F1C',
  
  // Text colors - Warm light tones
  text: '#FFFFFF', // Primary text on dark
  textSecondary: '#D6C8C2', // Secondary text
  textTertiary: '#A38F87', // Muted labels
  textInverse: '#2A1412',
  
  // Accent colors
  accent: '#E46A2E',
  accentLight: '#FF9A3C',
  accentDark: '#C85622',
  accentSecondary: '#FF9A3C',
  
  // Status colors - Adjusted for dark
  success: '#81C784',
  successLight: '#A5D6A7',
  warning: '#FF9A3C',
  warningLight: '#FFB366',
  error: '#E05545',
  errorLight: '#EF7A6A',
  info: '#7A9AB8',
  infoLight: '#9AB8D0',
  
  // Border colors
  border: '#4A2C20',
  borderLight: '#3A1F1C',
  borderDark: '#5A3D30',
  
  // Rating/Stars
  star: '#FF9A3C',
  starFilled: '#E46A2E',
  starEmpty: '#4A2C20',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.30)',
  shadowLight: 'rgba(0, 0, 0, 0.20)',
  shadowDark: 'rgba(0, 0, 0, 0.50)',
  
  // Glass effects
  glassBackground: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.20)',
  glassHighlight: 'rgba(228, 106, 46, 0.10)',
};
