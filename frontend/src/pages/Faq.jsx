import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Faq = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const faqs = [
    { q: "¿Cuáles son los métodos de pago aceptados?", a: "Aceptamos todas las tarjetas de crédito/débito principales y transferencias bancarias directas. Los pagos son procesados bajo estrictos estándares de seguridad." },
    { q: "¿Cuánto tarda en llegar mi pedido?", a: "Los envíos dentro de Quito tardan entre 1 a 2 días hábiles. A nivel nacional, el tiempo estimado es de 3 a 5 días hábiles." },
    { q: "¿Puedo cambiar mi talla si no me queda?", a: "Por supuesto. Tienes 30 días calendario desde la recepción de tu pedido para solicitar un cambio de talla sin costo adicional, siempre que la prenda esté en su estado original." },
    { q: "¿Sus prendas son realmente unisex?", a: "Sí. Nuestra moldería está desarrollada desde cero para adaptarse de manera estructurada y cómoda a cualquier tipo de cuerpo, sin etiquetas de género." }
  ];

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-stone-900 dark:text-zinc-100 font-sans selection:bg-stone-200 dark:selection:bg-zinc-850 pb-24 transition-colors duration-300">
      {/* Navbar simplificado */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-stone-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center relative">
          <Link to="/" className="text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver
          </Link>
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none dark:text-white">Intipa Churin</div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-36">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-center dark:text-white">Preguntas Frecuentes</h1>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-stone-100 dark:border-zinc-800 transition-colors duration-300">
              <h3 className="text-lg font-bold mb-3 dark:text-white">{faq.q}</h3>
              <p className="text-stone-600 dark:text-zinc-400 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Faq;