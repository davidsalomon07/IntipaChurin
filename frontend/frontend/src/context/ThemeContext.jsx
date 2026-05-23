import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos la "nube" (el contexto)
export const ThemeContext = createContext();

// 2. Creamos el componente proveedor que envolverá nuestra app
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'Light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Debug: Esto aparecerá en tu consola (F12) para confirmar que la lógica funciona
    console.log("Estado del tema en Intipa Churin:", theme);
    
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'Dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};