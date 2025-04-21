'use client';
import { useContext } from 'react';
import { AuthContext } from './auth-context';

// only exports a hook—no components here
export function useAuth() {
  return useContext(AuthContext);
}
