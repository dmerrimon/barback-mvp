import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00D4AA',
    background: '#FCFCFC',
    card: '#FFFFFF',
    text: '#32302f',
    border: '#E8E8E8',
    notification: '#FF6B6B',
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00D4AA',
    background: '#32302f',
    card: '#403E3B',
    text: '#fcfcfc',
    border: '#4A4845',
    notification: '#FF6B6B',
  },
};

export const colors = {
  // Brand Colors
  primary: '#00D4AA',
  primaryHover: '#00B899',
  secondary: '#0091FF',
  
  // Background Colors - Light Mode
  light: {
    background: '#FCFCFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    hover: '#F0F0F0',
  },
  
  // Background Colors - Dark Mode
  dark: {
    background: '#32302f',
    surface: '#403E3B',
    card: '#403E3B',
    hover: '#4A4845',
  },
  
  // Text Colors - Light Mode
  lightText: {
    primary: '#32302f',
    secondary: '#6B6B6B',
    muted: '#9B9B9B',
  },
  
  // Text Colors - Dark Mode
  darkText: {
    primary: '#fcfcfc',
    secondary: '#B8B8B8',
    muted: '#8A8A8A',
  },
  
  // Status Colors
  success: '#51CF66',
  warning: '#FFD43B',
  error: '#FF6B6B',
  info: '#0091FF',
  
  // Border Colors
  border: {
    light: '#E8E8E8',
    dark: '#4A4845',
  },
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
};