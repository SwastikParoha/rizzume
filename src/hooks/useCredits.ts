'use client';
import { useState, useEffect, useCallback } from 'react';

const CREDITS_KEY = 'rizzume_credits_v3';
const MAX_CREDITS = 100; // set back to 3 before going live

// Call this in the browser console to reset: window.__resetCredits()
if (typeof window !== 'undefined') {
  (window as Window & { __resetCredits?: () => void }).__resetCredits = () => {
    localStorage.setItem(CREDITS_KEY, String(MAX_CREDITS));
    location.reload();
  };
}

export function useCredits() {
  const [credits, setCredits] = useState<number>(MAX_CREDITS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CREDITS_KEY);
    if (stored === null) {
      localStorage.setItem(CREDITS_KEY, String(MAX_CREDITS));
      setCredits(MAX_CREDITS);
    } else {
      setCredits(Number(stored));
    }
    setIsLoaded(true);
  }, []);

  const useCredit = useCallback((): boolean => {
    const current = Number(localStorage.getItem(CREDITS_KEY) ?? MAX_CREDITS);
    if (current <= 0) return false;
    const next = current - 1;
    localStorage.setItem(CREDITS_KEY, String(next));
    setCredits(next);
    return true;
  }, []);

  return { credits, useCredit, isLoaded };
}
