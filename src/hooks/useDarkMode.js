import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    // 1. Respect explicit user choice stored in localStorage
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    // 2. Otherwise follow the OS/browser preference
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    // Also set a data attribute so CSS selectors can target it without a class
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return [darkMode, toggleDarkMode];
}

/*import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return [darkMode, toggleDarkMode];
}*/