import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const SizeGuide = () => {
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
            Ayuda y Soporte
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4 text-stone-900 dark:text-white">
            Guía de Tallas
          </h1>
          <p className="text-stone-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Nuestras siluetas están diseñadas sin distinciones de género. Utiliza esta tabla de medidas en centímetros para encontrar tu calce ideal.
          </p>
        </div>

        {/* Contenedor de la Tabla */}
        <div className="faq-glass rounded-3xl p-6 md:p-10 mb-12 overflow-hidden transition-transform hover:-translate-y-1">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="pb-4 font-bold text-stone-900 dark:text-white border-b border-stone-200 dark:border-zinc-800/60 uppercase text-xs tracking-wider">Talla</th>
                  <th className="pb-4 font-bold text-stone-900 dark:text-white border-b border-stone-200 dark:border-zinc-800/60 uppercase text-xs tracking-wider">Pecho (cm)</th>
                  <th className="pb-4 font-bold text-stone-900 dark:text-white border-b border-stone-200 dark:border-zinc-800/60 uppercase text-xs tracking-wider">Cintura (cm)</th>
                  <th className="pb-4 font-bold text-stone-900 dark:text-white border-b border-stone-200 dark:border-zinc-800/60 uppercase text-xs tracking-wider">Cadera (cm)</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base text-stone-600 dark:text-zinc-300">
                <tr className="border-b border-stone-100 dark:border-zinc-800/40 hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-semibold text-stone-900 dark:text-white">XS</td>
                  <td className="py-4">86 - 91</td>
                  <td className="py-4">71 - 76</td>
                  <td className="py-4">86 - 91</td>
                </tr>
                <tr className="border-b border-stone-100 dark:border-zinc-800/40 hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-semibold text-stone-900 dark:text-white">S</td>
                  <td className="py-4">91 - 96</td>
                  <td className="py-4">76 - 81</td>
                  <td className="py-4">91 - 96</td>
                </tr>
                <tr className="border-b border-stone-100 dark:border-zinc-800/40 hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition-colors bg-stone-50/50 dark:bg-zinc-800/10">
                  <td className="py-4 font-semibold text-stone-900 dark:text-white">M</td>
                  <td className="py-4">96 - 101</td>
                  <td className="py-4">81 - 86</td>
                  <td className="py-4">96 - 101</td>
                </tr>
                <tr className="border-b border-stone-100 dark:border-zinc-800/40 hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-semibold text-stone-900 dark:text-white">L</td>
                  <td className="py-4">101 - 106</td>
                  <td className="py-4">86 - 91</td>
                  <td className="py-4">101 - 106</td>
                </tr>
                <tr className="hover:bg-stone-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 font-semibold text-stone-900 dark:text-white">XL</td>
                  <td className="py-4">106 - 111</td>
                  <td className="py-4">91 - 96</td>
                  <td className="py-4">106 - 111</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instrucciones de medición */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-stone-900 dark:text-white">¿Cómo tomar tus medidas?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="faq-glass rounded-2xl p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-white mb-2">1. Pecho</h3>
              <p className="text-sm text-stone-500 dark:text-zinc-400 leading-relaxed">
                Mide el contorno de la parte más ancha del pecho, manteniendo la cinta métrica horizontal.
              </p>
            </div>

            <div className="faq-glass rounded-2xl p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-white mb-2">2. Cintura</h3>
              <p className="text-sm text-stone-500 dark:text-zinc-400 leading-relaxed">
                Mide alrededor de la parte más estrecha de la cintura, generalmente justo por encima del ombligo.
              </p>
            </div>

            <div className="faq-glass rounded-2xl p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800/50 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-stone-900 dark:text-white">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-white mb-2">3. Cadera</h3>
              <p className="text-sm text-stone-500 dark:text-zinc-400 leading-relaxed">
                Mantén los pies juntos y mide la parte más ancha de la cadera, asegurando que la cinta esté nivelada.
              </p>
            </div>

          </div>
        </div>

        {/* Soporte */}
        <div className="text-center mt-12">
          <p className="text-stone-500 dark:text-zinc-400 text-sm mb-4">
            ¿Tus medidas están entre dos tallas? Te recomendamos elegir la mayor para un fit más relajado.
          </p>
          <Link to="/contacto" className="inline-flex items-center justify-center h-12 px-8 bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-full text-sm font-medium transition-colors">
            Consultar con un asesor
          </Link>
        </div>

      </main>
    </div>
  );
};

export default SizeGuide;