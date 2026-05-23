import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniFooter from '../components/MiniFooter'; // Importamos tu componente oficial

const Lookbook = () => {
  // Asegura que la navegación empiece desde la parte superior
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300 flex flex-col">
      
      {/* Navbar con botón de volver habilitado */}
      <Navbar backButton={true} />

      {/* --- CABECERA EDITORIAL --- */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-[1200px] mx-auto text-center">
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400 dark:text-zinc-500 mb-6 block">
          Campaña 2026
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 dark:text-white">
          Trazabilidad Total.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          No solo diseñamos ropa; diseñamos un ecosistema transparente. Conoce el recorrido exacto de nuestras prendas, desde el hilo hasta tus manos, optimizando cada paso logístico.
        </p>
      </section>

      {/* --- SECCIÓN DE TRAZABILIDAD (Misión Comercial) --- */}
      <section className="py-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-3xl flex flex-col justify-center text-center items-center">
            <span className="text-4xl mb-4 block">🌿</span>
            <h3 className="text-lg font-bold mb-3 dark:text-white">Origen Ético</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Algodón recuperado y materiales trazables desde el primer proveedor.</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-3xl flex flex-col justify-center text-center items-center">
            <span className="text-4xl mb-4 block">📦</span>
            <h3 className="text-lg font-bold mb-3 dark:text-white">Gestión de Stock</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Producción controlada para evitar el sobre-stock y minimizar la huella de carbono.</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-900 p-10 rounded-3xl flex flex-col justify-center text-center items-center">
            <span className="text-4xl mb-4 block">📄</span>
            <h3 className="text-lg font-bold mb-3 dark:text-white">Transparencia</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Documentación post-venta clara. Sabes exactamente por qué pagas lo que pagas.</p>
          </div>
        </div>
      </section>

      {/* --- GALERÍA LOOKBOOK (Estilo Revista) --- */}
      <section className="py-20 px-6 md:px-12 max-w-[1600px] mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          
          {/* Look 01 */}
          <div className="group relative w-full h-[600px] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <img 
              src="https://placehold.co/800x1000/e7e5e4/a8a29e?text=LOOK+01" 
              alt="Look 01" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-xs font-bold tracking-widest uppercase mb-2 block">Look 01</span>
              <h3 className="text-3xl font-bold mb-4">Urbano & Consciente</h3>
              <Link to="/shop?search=hoodie" className="text-sm font-semibold underline underline-offset-8 hover:text-zinc-300 transition-colors">
                Comprar el Look
              </Link>
            </div>
          </div>

          {/* Look 02 */}
          <div className="group relative w-full h-[600px] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:mt-20">
            <img 
              src="https://placehold.co/800x1000/d6d3d1/78716c?text=LOOK+02" 
              alt="Look 02" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-xs font-bold tracking-widest uppercase mb-2 block">Look 02</span>
              <h3 className="text-3xl font-bold mb-4">Siluetas Parachute</h3>
              <Link to="/shop?search=pantalon" className="text-sm font-semibold underline underline-offset-8 hover:text-zinc-300 transition-colors">
                Comprar el Look
              </Link>
            </div>
          </div>

          {/* Look 03 */}
          <div className="group relative w-full h-[600px] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:-mt-20">
            <img 
              src="https://placehold.co/800x1000/f5f5f4/d6d3d1?text=LOOK+03" 
              alt="Look 03" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
            <div className="absolute bottom-10 left-10 text-white">
              <span className="text-xs font-bold tracking-widest uppercase mb-2 block">Look 03</span>
              <h3 className="text-3xl font-bold mb-4">Básicos Esenciales</h3>
              <Link to="/shop?search=camiseta" className="text-sm font-semibold underline underline-offset-8 hover:text-zinc-300 transition-colors">
                Comprar el Look
              </Link>
            </div>
          </div>

          {/* Enlace final a tienda */}
          <div className="flex flex-col justify-center items-center text-center p-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl h-[600px]">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Explora el Catálogo</h2>
            <p className="text-zinc-400 dark:text-zinc-500 mb-10 max-w-sm">
              Cada prenda en nuestro sistema está registrada y controlada para asegurar la máxima calidad.
            </p>
            <Link to="/shop" className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300">
              Ir a la Tienda
            </Link>
          </div>

        </div>
      </section>

      {/* Renderizado de tu MiniFooter oficial al final */}
      <MiniFooter />
    </div>
  );
};

export default Lookbook;