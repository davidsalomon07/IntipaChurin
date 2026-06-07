import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-stone-900 dark:text-zinc-100 font-sans selection:bg-stone-200 dark:selection:bg-zinc-850 pb-24 transition-colors duration-300">
      
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

      <main className="max-w-3xl mx-auto px-6 pt-36">
        <h1 className="text-4xl font-bold tracking-tight mb-12 dark:text-white">Aviso de Privacidad</h1>
        
        <div className="space-y-8 text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">1. Recopilación de Información</h2>
            <p>Cuando realizas una compra en nuestra tienda, como parte del proceso de compraventa, recopilamos la información personal que nos proporcionas, como tu nombre, dirección de envío, número de teléfono y correo electrónico. Cuando navegas por nuestra tienda, también recibimos automáticamente la dirección de protocolo de internet (IP) de tu computadora.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">2. Uso de tu Información</h2>
            <p>Utilizamos tu información personal principalmente para procesar y despachar tus pedidos, gestionar devoluciones y proporcionarte un excelente servicio al cliente. Si nos das tu consentimiento, podremos enviarte correos electrónicos sobre nuestra tienda, nuevos lanzamientos de colecciones y otras actualizaciones (Newsletter).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">3. Protección y Consentimiento</h2>
            <p>Tomamos precauciones razonables y seguimos las mejores prácticas de la industria para asegurarnos de que tu información no se pierda de manera inapropiada, se use mal, se acceda, se divulgue, se altere o se destruya. Intipa Churin nunca venderá ni cederá tu base de datos a terceros con fines comerciales o de marketing sin tu autorización explícita.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;