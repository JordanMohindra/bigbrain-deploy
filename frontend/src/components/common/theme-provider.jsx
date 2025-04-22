'use client';

import { useState, useEffect } from 'react';
import { ThemeContext } from './theme-context';
import { UseTheme } from './use-theme';
import { Moon, Sun } from 'lucide-react';

// Only component exports in this file
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = UseTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-accent transition-colors"
      aria-label={
        theme === 'light'
          ? 'Switch to dark mode'
          : 'Switch to light mode'
      }
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}