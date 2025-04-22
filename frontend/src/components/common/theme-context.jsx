import { createContext } from 'react';

// shared context constant only
export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});