/**
 * Color Constants - Centralized color configuration for the application
 * This file contains all the color values used throughout the application
 * to ensure consistency and easy maintenance.
 */
export const COLORS = {
  // Primary Colors (Microsoft Fluent UI)
  primary: '#0078d4',

  // Background Colors
  backgroundPrimary: '#ffffff',

  // Text Colors
  textHeaderPrimary: '#ffffff',
} as const;

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  const cssVariables: Record<string, string> = {};

  Object.entries(COLORS).forEach(([key, value]) => {
    const cssKey = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    cssVariables[cssKey] = value;
  });

  return cssVariables;
};

// Helper function to get color with fallback
export const getColor = (colorKey: keyof typeof COLORS, fallback: string = '#000000'): string => {
  return COLORS[colorKey] || fallback;
};

// Type for color keys (useful for TypeScript)
export type ColorKey = keyof typeof COLORS;
