import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos la "nube" para el idioma
export const LanguageContext = createContext();

// 2. Creamos el proveedor
export const LanguageProvider = ({ children }) => {
  // Leemos si el usuario ya tenía un idioma guardado, por defecto será Español
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'Español';
  });

  // Cada vez que cambie el idioma, lo guardamos en el navegador
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // NOTA: Aquí a futuro conectaremos los diccionarios de traducción 
    // cuando empecemos a cambiar los textos de la página.
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};