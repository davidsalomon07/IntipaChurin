import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  // 1. ESTO ARREGLA EL PROBLEMA DEL SCROLL (Obliga a cargar arriba del todo)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 pb-20">
      
      {/* --- NAVBAR (Fijo y perfectamente centrado) --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 h-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center relative">
          
          {/* Botón Izquierda */}
          <Link to="/" className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver
          </Link>

          {/* Logo Centro Absoluto */}
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none">
            Intipa Churin
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO EDITORIAL --- */}
      {/* Añadido pt-36 para que el texto no se esconda detrás del navbar fijo */}
      <main className="max-w-3xl mx-auto px-6 pt-36">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center">
          Nuestra Esencia
        </h1>
        
        <div className="aspect-video w-full bg-stone-100 rounded-[2rem] overflow-hidden mb-16 shadow-sm">
          <img 
            src="https://placehold.co/1200x600/e7e5e4/a8a29e?text=FOTO+DEL+TALLER+O+MARCA" 
            alt="Intipa Churin Studio" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[10s]"
          />
        </div>

        {/* Textos centrados y con mayor interlineado */}
        <div className="space-y-8 text-stone-600 leading-relaxed text-lg text-center">
          <p>
            Intipa Churin nace de la necesidad de fusionar la estética de alta costura con una estructura comercial inquebrantable. No solo vestimos; ofrecemos una experiencia fluida donde la elegancia del diseño se refleja en la trazabilidad y el control absoluto de cada prenda.
          </p>
          <p>
            Nuestras colecciones son diseñadas en Quito, priorizando siluetas modernas y versátiles, concebidas sin distinciones de género para garantizar una comodidad absoluta y libertad de expresión.
          </p>
          
          <div className="pt-12 pb-8">
            <div className="w-12 h-[1px] bg-stone-300 mx-auto mb-8"></div>
            <p className="font-semibold text-stone-900 text-xl italic px-4">
              "La intersección entre la herencia y el futuro. Logística impecable para un diseño sin concesiones."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;