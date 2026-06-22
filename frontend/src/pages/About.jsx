import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-stone-900 dark:text-zinc-100 font-sans selection:bg-stone-200 dark:selection:bg-zinc-800 pb-20 transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-stone-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center relative">
          <Link to="/" className="text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver
          </Link>
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none dark:text-white">
            Intipa Churin
          </div>
        </div>
      </nav>

      {/* CONTENIDO EDITORIAL */}
      <main className="max-w-4xl mx-auto px-6 pt-36">
        
        {/* Cabecera estilo FAQ */}
        <div className="text-center mb-16">
          <span className="text-stone-400 dark:text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">
            Nuestra Historia
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-stone-900 dark:text-white">
            La esencia detrás de la marca
          </h1>
          <p className="text-stone-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Fusionamos la estética de alta costura con una estructura comercial inquebrantable.
          </p>
        </div>

        {/* Contenedor principal con efecto Glassmorphism */}
        <div className="faq-glass rounded-3xl p-2 md:p-3 mb-8 shadow-sm">
          <div className="aspect-[21/9] w-full bg-stone-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative group">
            <img 
              src="https://placehold.co/1200x600/161920/3f3f46?text=TALLER+INTIPA+CHURIN" 
              alt="Intipa Churin Studio" 
              className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 opacity-90 dark:opacity-80"
            />
            {/* Overlay con texto integrado estilo hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 md:p-10">
              <p className="text-white text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                No solo vestimos; ofrecemos una experiencia fluida donde la elegancia del diseño se refleja en la trazabilidad y el control absoluto de cada prenda.
              </p>
            </div>
          </div>
        </div>

        {/* Pilares de la marca - Reutilizando el diseño de los botones de FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          
          <div className="faq-glass rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800/50 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="text-stone-900 dark:text-white font-semibold text-lg mb-2">Diseño Local</h3>
            <p className="text-stone-500 dark:text-zinc-400 text-sm leading-relaxed">
              Nuestras colecciones son diseñadas y estructuradas en Chile, asegurando calidad y atención al detalle desde el origen.
            </p>
          </div>

          <div className="faq-glass rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800/50 flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3 className="text-stone-900 dark:text-white font-semibold text-lg mb-2">Sin Distinciones</h3>
            <p className="text-stone-500 dark:text-zinc-400 text-sm leading-relaxed">
              Siluetas modernas concebidas sin barreras de género, garantizando comodidad absoluta y libertad de expresión.
            </p>
          </div>

        </div>

        {/* Sección de Cita / Manifiesto */}
        <div className="faq-glass rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="w-12 h-[1px] bg-stone-300 dark:bg-zinc-700 mx-auto mb-8"></div>
          <p className="font-medium text-stone-900 dark:text-white text-xl md:text-2xl italic px-4 relative z-10 leading-relaxed tracking-wide">
            "La intersección entre la herencia y el futuro. Logística impecable para un diseño sin concesiones."
          </p>
          <div className="w-12 h-[1px] bg-stone-300 dark:bg-zinc-700 mx-auto mt-8"></div>
        </div>

      </main>
    </div>
  );
};

export default About;