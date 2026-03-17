import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
  });

  // The original setter didn't support functional updater pattern (prev => ...)
  // which is what RecipeContext now uses everywhere. This fixes that.
  const setValue = useCallback((value) => {
    try {
      setStoredValue(prev => {
        const next = typeof value === 'function' ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    } catch (error) {
      console.error(`useLocalStorage: error setting key "${key}"`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/*import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}*/