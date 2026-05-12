import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- Usamos el Navbar de tu amigo
import MiniFooter from '../components/MiniFooter';
import { useCart } from '../context/CartContext';

// Base de datos de prueba
const productosSimulados = [
  { id: 1, nombre: "Essential Hoodie", precio: 65.00, categoria: "hoodies" },
  { id: 2, nombre: "Oversize Basic Tee", precio: 35.00, categoria: "camisetas" },
  { id: 3, nombre: "Cargo Pant Parachute", precio: 75.00, categoria: "pantalones" },
  { id: 4, certificacion: true, nombre: "Heavyweight Hoodie", precio: 70.00, categoria: "hoodies" },
  { id: 5, nombre: "Classic Boxy Tee", precio: 30.00, categoria: "camisetas" },
  { id: 6, nombre: "Straight Leg Denim", precio: 80.00, categoria: "pantalones" },
  { id: 7, nombre: "Washed Vintage Tee", precio: 40.00, categoria: "camisetas" },
  { id: 8, nombre: "Zip-Up Minimal Hoodie", precio: 68.00, categoria: "hoodies" },
];

const Shop = () => {
  const { category } = useParams();
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Extraemos la función para añadir productos. 
  // (La apertura del carrito y el totalItems ahora los maneja el componente Navbar directamente)
  const { agregarAlCarrito } = useCart();
  
  const [sortOption, setSortOption] = useState('Ordenar por: Destacados');
  const sortOptions = ['Ordenar por: Destacados', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor', 'Nuevos'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const productosFiltrados = category 
    ? productosSimulados.filter(p => p.categoria.toLowerCase() === category.toLowerCase())
    : productosSimulados;

  const tituloPagina = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : "Catálogo Completo";

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col transition-colors duration-300">
      
      {/* --- INYECTAMOS EL NAVBAR REUTILIZABLE --- */}
      <Navbar />

      {/* --- CONTENIDO DE LA TIENDA --- */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-6 gap-4 relative">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 dark:text-white">{tituloPagina}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{productosFiltrados.length} productos encontrados</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
              className="flex items-center justify-between gap-3 bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm rounded-full px-5 py-2 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors focus:outline-none min-w-[220px]"
            >
              <span>{sortOption}</span>
              <svg className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <div className={`absolute top-full right-0 mt-2 w-full min-w-[220px] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl rounded-2xl py-2 z-20 origin-top-right transition-all duration-200 ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              {sortOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSortOption(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOption === option ? 'font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-700' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Productos */}
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-5 relative transition-colors duration-300">
                  <img 
                    src={`https://placehold.co/600x800/f5f5f4/d6d3d1?text=${item.categoria.toUpperCase()}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={item.nombre}
                  />
                  
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        agregarAlCarrito(item);
                      }}
                      title="Añadir al carrito"
                      className="w-11 h-11 rounded-full flex items-center justify-center shadow-2xl border transform transition-all duration-150 active:scale-90 active:shadow-md bg-zinc-950 text-white hover:bg-zinc-800 border-transparent dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">{item.nombre}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">$ {item.precio.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
            No hay productos disponibles en esta categoría.
          </div>
        )}
      </main>

      <MiniFooter />
    </div>
  );
};

export default Shop;