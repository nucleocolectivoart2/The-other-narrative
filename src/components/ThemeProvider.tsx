'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'editorial' | 'digital' | 'ocean' | 'gold';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-editorial', 'theme-digital', 'theme-ocean', 'theme-gold');
    localStorage.setItem('app-theme', 'editorial');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'editorial', setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}