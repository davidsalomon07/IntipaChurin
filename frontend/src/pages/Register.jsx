import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;

const Register = () => {
  // Ahora tenemos firstName y lastName separados
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);

    try {
      // Ahora enviamos first_name y last_name al backend
      const response = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrar la cuenta');
      }

      setSuccess("¡Cuenta creada con éxito! Redirigiendo...");
      
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-16 selection:bg-stone-200 dark:selection:bg-zinc-800 text-stone-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12">
        <Link to="/" className="text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Volver
        </Link>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-sm border border-stone-100 dark:border-zinc-800 transition-colors duration-300">
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-xl font-bold tracking-widest uppercase mb-6 sm:mb-8 text-center dark:text-white">
            Intipa Churin
          </h1>
          
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 dark:text-white">Crear cuenta</h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400">Únete para acceder a colecciones exclusivas.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Grid de 2 columnas para Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                Nombre
              </label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ej. David" 
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-stone-400 dark:focus:ring-zinc-500 transition-all placeholder:text-stone-300 dark:placeholder:text-zinc-550"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                Apellido
              </label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ej. Salomón" 
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-stone-400 dark:focus:ring-zinc-500 transition-all placeholder:text-stone-300 dark:placeholder:text-zinc-550"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com" 
              className="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-stone-400 dark:focus:ring-zinc-500 transition-all placeholder:text-stone-300 dark:placeholder:text-zinc-550"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-stone-400 dark:focus:ring-zinc-500 transition-all placeholder:text-stone-300 dark:placeholder:text-zinc-550"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 hover:text-stone-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1.5">
                Confirmar
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-4 pr-10 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-stone-400 dark:focus:ring-zinc-500 transition-all placeholder:text-stone-300 dark:placeholder:text-zinc-550"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500 hover:text-stone-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 sm:py-3.5 rounded-xl text-sm font-semibold hover:bg-stone-850 dark:hover:bg-zinc-200 transition-all shadow-sm mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-500 dark:text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold text-stone-900 dark:text-white hover:text-stone-600 dark:hover:text-zinc-300 border-b border-stone-900 dark:border-white hover:border-stone-600 dark:hover:border-zinc-300 pb-px transition-all">
              Iniciar sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;