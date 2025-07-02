import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('barback-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('barback-theme', isDark ? 'dark' : 'light');
    
    // Apply theme to document with your custom colors
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Update CSS custom properties with your specific colors
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#32302f');  // Your dark background
      root.style.setProperty('--bg-secondary', '#3A3835');
      root.style.setProperty('--bg-tertiary', '#403E3B');
      root.style.setProperty('--bg-card', '#403E3B');
      root.style.setProperty('--bg-hover', '#4A4845');
      root.style.setProperty('--text-primary', '#fcfcfc');  // Light text on dark background
      root.style.setProperty('--text-secondary', '#B8B8B8');
      root.style.setProperty('--text-muted', '#8A8A8A');
      root.style.setProperty('--border-color', '#4A4845');
      root.style.setProperty('--border-hover', '#5A5855');
      root.style.setProperty('--logo-url', 'url("/assets/logo-light.png")');
    } else {
      root.style.setProperty('--bg-primary', '#FCFCFC');  // Your light background
      root.style.setProperty('--bg-secondary', '#F8F8F8');
      root.style.setProperty('--bg-tertiary', '#F0F0F0');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--bg-hover', '#F0F0F0');
      root.style.setProperty('--text-primary', '#32302f');  // Dark text on light background
      root.style.setProperty('--text-secondary', '#6B6B6B');
      root.style.setProperty('--text-muted', '#9B9B9B');
      root.style.setProperty('--border-color', '#E8E8E8');
      root.style.setProperty('--border-hover', '#D8D8D8');
      root.style.setProperty('--logo-url', 'url("/assets/logo-dark.png")');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};