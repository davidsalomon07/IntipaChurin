import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // Estados para capturar los datos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Nuevo estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', { email, password });
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen flex flex-col justify-center items-center px-6 selection:bg-stone-200 text-stone-900 font-sans">
      
      {/* Botón para volver al inicio */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <Link to="/" className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver
        </Link>
      </div>

      {/* Contenedor Principal (Proporciones amplias originales) */}
      <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-[2rem] shadow-sm border border-stone-100">
        
        {/* Cabecera del Formulario */}
        <div className="mb-10">
          <h1 className="text-xl font-bold tracking-widest uppercase mb-10 text-center">
            Intipa Churin
          </h1>
          
          <div className="text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Acceso a tu cuenta</h2>
            <p className="text-sm text-stone-500">Ingresa tus credenciales para continuar.</p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com" 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                Contraseña
              </label>
              <a href="#" className="text-xs font-medium text-stone-400 hover:text-stone-900 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            
            {/* Contenedor relativo para posicionar el ícono del ojo */}
            <div className="relative">
              <input 
                // El tipo cambia dinámicamente según el estado showPassword
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                // Añadido pr-12 (padding-right) para que el texto no se monte sobre el ícono
                className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
              />
              
              {/* Botón flotante para ver/ocultar contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  // Ícono de "Ojo tachado" (Ocultar)
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  // Ícono de "Ojo normal" (Mostrar)
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="w-full bg-stone-900 text-white py-4 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm mt-4"
          >
            Entrar
          </button>
        </form>

        {/* Pie del Login */}
        <div className="mt-10 text-center">
          <p className="text-sm text-stone-500">
            ¿Aún no tienes una cuenta?{' '}
            <Link to="/register" className="font-bold text-stone-900 hover:text-stone-600 border-b border-stone-900 hover:border-stone-600 pb-px transition-all">
              Crear cuenta
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;