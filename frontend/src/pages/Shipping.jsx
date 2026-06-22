import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shipping = () => {
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-6 pt-36">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <span className="text-stone-400 dark:text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">
            Soporte y Logística
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-stone-900 dark:text-white">
            Envíos y Devoluciones
          </h1>
          <p className="text-stone-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre nuestros tiempos de entrega y el proceso para realizar cambios.
          </p>
        </div>

        {/* Tarjetas de Políticas */}
        <div className="space-y-6">
          
          {/* Tarjeta 1: Envíos */}
          <section className="faq-glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-stone-900 dark:text-white">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-white mb-3">1. Política de Envíos</h2>
              <div className="space-y-3 text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                <p>Todos los pedidos son procesados en nuestro centro de distribución en un plazo de 24 horas hábiles tras la confirmación del pago.</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Quito:</strong> 1 a 2 días hábiles.</li>
                  <li><strong>Resto de provincias:</strong> 3 a 5 días hábiles.</li>
                </ul>
                <p className="mt-4 inline-block px-3 py-1 bg-stone-100 dark:bg-zinc-800 rounded-md text-xs font-semibold text-stone-800 dark:text-zinc-300">
                  Ofrecemos envío gratuito en compras superiores a $100.
                </p>
              </div>
            </div>
          </section>

          {/* Tarjeta 2: Cambios y Devoluciones */}
          <section className="faq-glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-stone-900 dark:text-white">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-white mb-3">2. Cambios y Devoluciones</h2>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base mb-4">
                Queremos que ames lo que compras. Si por alguna razón la talla o el fit no es el adecuado, tienes <strong>30 días calendario</strong> desde la recepción de tu paquete para solicitar un cambio.
              </p>
              <div className="p-4 border border-stone-200 dark:border-zinc-800 rounded-xl bg-white/50 dark:bg-zinc-900/30">
                <p className="text-xs md:text-sm text-stone-500 dark:text-zinc-400">
                  <strong>Requisitos:</strong> Para que la devolución sea válida, la prenda debe estar completamente sin uso, sin lavar, con todas sus etiquetas originales adheridas y en su empaque original.
                </p>
              </div>
            </div>
          </section>

          {/* Tarjeta 3: Excepciones */}
          <section className="faq-glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-stone-900 dark:text-white">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-white mb-3">3. Artículos no retornables</h2>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
                Por razones de higiene y políticas de la empresa, no aceptamos cambios ni devoluciones en artículos de ropa interior, medias o accesorios de uso personal. 
                <br className="hidden md:block" /><br className="hidden md:block" />
                La única excepción a esta regla aplica si los artículos presentan un defecto de fábrica comprobable al momento de abrir el paquete.
              </p>
            </div>
          </section>

        </div>
        
        {/* Call to action de soporte */}
        <div className="mt-16 text-center">
          <p className="text-stone-500 dark:text-zinc-400 text-sm mb-4">
            ¿Tienes alguna duda sobre tu proceso de cambio o envío?
          </p>
          <Link to="/contacto" className="inline-flex items-center justify-center h-12 px-8 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-full text-sm font-medium transition-colors">
            Contactar al equipo
          </Link>
        </div>

      </main>
    </div>
  );
};

export default Shipping;