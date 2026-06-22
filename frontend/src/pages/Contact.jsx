import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
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
            Atención personalizada
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-stone-900 dark:text-white">
            Contacto
          </h1>
          <p className="text-stone-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            ¿Tienes alguna consulta sobre tu pedido, textiles o colaboraciones? Estamos aquí para guiarte.
          </p>
        </div>

        {/* Canales de Comunicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Canal 1: WhatsApp */}
          <a 
            href="https://wa.me/tu_numero" 
            target="_blank" 
            rel="noopener noreferrer"
            className="faq-glass rounded-3xl p-8 flex gap-6 items-start transition-all hover:-translate-y-1 hover:border-stone-300 dark:hover:border-zinc-700"
          >
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Atención Inmediata</h2>
              <p className="text-sm text-stone-500 dark:text-zinc-400 mb-4">
                Escríbenos directamente a nuestra línea de WhatsApp para resolver dudas rápidas sobre stock o compras.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-white border-b border-stone-900 dark:border-white pb-0.5">
                Iniciar chat →
              </span>
            </div>
          </a>

          {/* Canal 2: Correo Electrónico */}
          <a 
            href="mailto:soporte@intipachurin.com" 
            className="faq-glass rounded-3xl p-8 flex gap-6 items-start transition-all hover:-translate-y-1 hover:border-stone-300 dark:hover:border-zinc-700"
          >
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-zinc-800/50 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-1">Consultas y Soporte</h2>
              <p className="text-sm text-stone-500 dark:text-zinc-400 mb-4">
                Para inconvenientes con envíos, devoluciones o propuestas institucionales, escríbenos por e-mail.
              </p>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-white border-b border-stone-900 dark:border-white pb-0.5">
                Enviar correo →
              </span>
            </div>
          </a>

        </div>

        {/* Tarjeta de Horarios / Información Adicional */}
        <div className="faq-glass rounded-3xl p-8 md:p-10 text-center transition-transform hover:-translate-y-1">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">Horarios de Respuesta</h3>
          <p className="text-stone-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base max-w-xl mx-auto">
            Nuestro equipo responde de <strong>Lunes a Viernes de 09:00 a 18:00</strong>. Las solicitudes recibidas durante el fin de semana serán procesadas prioritariamente el siguiente día hábil.
          </p>
        </div>

      </main>
    </div>
  );
};

export default Contact;