import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
        <h1 className="text-4xl font-bold tracking-tight mb-12 dark:text-white">Términos de Servicio</h1>
        
        <div className="space-y-8 text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">1. Condiciones Generales</h2>
            <p>Al acceder y utilizar el sitio web de Intipa Churin, aceptas estar sujeto a los siguientes términos y condiciones. Nos reservamos el derecho de rechazar el servicio a cualquier persona, por cualquier motivo y en cualquier momento. El uso continuado de nuestro sitio web constituye tu aceptación de estos términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">2. Precios y Productos</h2>
            <p>Los precios de nuestros productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o discontinuar cualquier producto o colección en cualquier momento. Hemos hecho todo lo posible para mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos, pero no podemos garantizar que la pantalla de tu monitor muestre los colores con total exactitud.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">3. Propiedad Intelectual</h2>
            <p>Todo el contenido incluido en este sitio, como textos, gráficos, logotipos, imágenes, audios, descargas digitales y compilaciones de datos, es propiedad exclusiva de Intipa Churin y está protegido por las leyes de derechos de autor y propiedad intelectual. Queda estrictamente prohibida su reproducción sin autorización expresa.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;