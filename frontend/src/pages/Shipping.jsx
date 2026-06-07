import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shipping = () => {
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
        <h1 className="text-4xl font-bold tracking-tight mb-12 dark:text-white">Envíos y Devoluciones</h1>
        
        <div className="space-y-8 text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">1. Política de Envíos</h2>
            <p>Todos los pedidos son procesados en nuestro centro de distribución en un plazo de 24 horas hábiles tras la confirmación del pago. Los envíos dentro de la ciudad de Quito toman de 1 a 2 días hábiles, mientras que los envíos a otras provincias pueden tomar entre 3 y 5 días hábiles. Ofrecemos envío gratuito en compras superiores a $100.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">2. Cambios y Devoluciones</h2>
            <p>Queremos que ames lo que compras. Si por alguna razón la talla o el fit no es el adecuado, tienes 30 días calendario desde la recepción de tu paquete para solicitar un cambio. Para que la devolución sea válida, la prenda debe estar completamente sin uso, sin lavar, con todas sus etiquetas originales adheridas y en su empaque original.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-4">3. Artículos no retornables</h2>
            <p>Por razones de higiene y políticas de la empresa, no aceptamos cambios ni devoluciones en artículos de ropa interior, medias o accesorios de uso personal, a menos que presenten un defecto de fábrica comprobable al momento de abrir el paquete.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Shipping;