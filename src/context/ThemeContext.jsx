import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Try to get theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    // If no preference is saved, use system preference
    if (savedTheme) {
      return savedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Update localStorage when theme changes
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};