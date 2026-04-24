import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    console.log('Registrando nuevo usuario:', { name, email, password });
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen flex flex-col justify-center items-center px-6 selection:bg-stone-200 text-stone-900 font-sans py-8">
      
      {/* Botón para volver al inicio */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <Link to="/" className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver
        </Link>
      </div>

      {/* Contenedor Principal más compacto (p-8 en lugar de p-12) */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-100">
        
        {/* Cabecera del Formulario */}
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-widest uppercase mb-8 text-center">
            Intipa Churin
          </h1>
          
          <div className="text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Crear cuenta</h2>
            <p className="text-sm text-stone-500">Únete para acceder a colecciones exclusivas.</p>
          </div>
        </div>

        {/* Formulario con menor espacio vertical (space-y-4) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nombre Completo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Nombre Completo
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez" 
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com" 
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
            />
          </div>

          {/* Grid de 2 columnas para contraseñas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Contraseña
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Confirmar
              </label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all placeholder:text-stone-300"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="w-full bg-stone-900 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm mt-2"
          >
            Crear Cuenta
          </button>
        </form>

        {/* Pie del Registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-stone-900 hover:text-stone-600 border-b border-stone-900 hover:border-stone-600 pb-px transition-all">
              Iniciar sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;