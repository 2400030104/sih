import React, { createContext, useContext, useState, useLayoutEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const THEME_VARIABLES = {
  '--gov-bg': '#F8FAFC',
  '--gov-surface': '#FFFFFF',
  '--gov-card': '#FFFFFF',
  '--gov-elevated': '#F1F5F9',
  '--gov-hover': '#F1F5F9',
  '--gov-border': '#E2E8F0',
  '--gov-border-subtle': '#F1F5F9',
  '--gov-border-light': '#CBD5E1',
  '--gov-text-primary': '#0F172A',
  '--gov-text-secondary': '#334155',
  '--gov-text-muted': '#64748B',
  '--gov-text-disabled': '#94A3B8',
  'color-scheme': 'light'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('light');

  const applyTheme = () => {
    const root = document.documentElement;
    const body = document.body;

    Object.entries(THEME_VARIABLES).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    root.classList.add('light');
    root.classList.remove('dark');
    body.classList.add('light');
    body.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    body.style.backgroundColor = '#F8FAFC';
    body.style.color = '#0F172A';

    try {
      localStorage.setItem('pragati_theme', 'light');
    } catch (e) {}
  };

  useLayoutEffect(() => {
    applyTheme();
  }, []);

  const toggleTheme = () => {
    // SaaS theme is purely light
    applyTheme();
  };

  const setTheme = () => {
    applyTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
