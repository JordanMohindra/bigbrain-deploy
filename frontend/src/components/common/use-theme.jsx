'use client';
import { useContext } from 'react';
import { ThemeContext } from './theme-context';

// only exports a hook (lowercase)—no components here
export function UseTheme() {
  return useContext(ThemeContext);
}