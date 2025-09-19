import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
}

const ThemeProviderContext = createContext<ThemeProviderContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

export function ThemeProvider({ 
  children, 
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = true 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const updateTheme = () => {
      let resolvedTheme: 'dark' | 'light' = 'light';
      
      if (theme === 'system' && enableSystem) {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else if (theme === 'dark' || theme === 'light') {
        resolvedTheme = theme;
      }
      
      setActualTheme(resolvedTheme);
      
      if (attribute === 'class') {
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
      } else {
        root.setAttribute(attribute, resolvedTheme);
      }
    };

    updateTheme();
    localStorage.setItem('theme', theme);

    if (theme === 'system' && enableSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme, attribute, enableSystem]);

  const value = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};