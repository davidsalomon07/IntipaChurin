import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- Usamos el Navbar de tu amigo
import MiniFooter from '../components/MiniFooter';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const { category } = useParams();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { agregarAlCarrito } = useCart();
  
  const [sortOption, setSortOption] = useState('Ordenar por: Destacados');
  const sortOptions = ['Ordenar por: Destacados', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor', 'Nuevos'];

  // --- ESTADOS PARA DATOS REALES ---
  const [productosDB, setProductosDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/products');
        if (res.ok) {
          const data = await res.json();
          // Traemos todos los productos activos
          setProductosDB(data.filter(p => p.is_active));
        }
      } catch (error) {
        console.error("Error al cargar catálogo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtramos por categoría o aplicamos lógica de "Nuevos" si la URL lo pide
  let productosFiltrados = [];
  
  if (category && category.toLowerCase() === 'nuevos') {
    // Si estamos en la pestaña Nuevos: ordenamos del último ID creado al primero y tomamos los 10 primeros
    productosFiltrados = [...productosDB]
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);
  } else if (category) {
    // Si estamos en una categoría normal (ej. hoodies): filtramos por nombre exacto
    productosFiltrados = productosDB.filter(p => p.category_name && p.category_name.toLowerCase() === category.toLowerCase());
  } else {
    // Si no hay categoría (ej. /shop a secas): mostramos todo
    productosFiltrados = productosDB;
  }

  // Título dinámico para la cabecera
  const tituloPagina = category && category.toLowerCase() === 'nuevos'
    ? "Nuevos Ingresos"
    : category 
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
        {isLoading ? (
          <div className="py-24 flex justify-center text-zinc-400 w-full">
            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-5 relative transition-colors duration-300">
                  <img 
                    src={item.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=SIN+FOTO`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={item.name}
                  />
                  
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Ajustamos las variables de tu backend para que encajen con tu carrito
                        agregarAlCarrito({
                          id: item.id,
                          nombre: item.name,
                          precio: parseFloat(item.price),
                          categoria: item.category_name,
                          imagen: item.image_url
                        });
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
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1 truncate">{item.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">$ {parseFloat(item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center w-full">
            <p>Tu catálogo está vacío por el momento.</p>
            <p className="text-xs mt-2">¡Comienza a crear productos desde tu panel de administrador!</p>
          </div>
        )}
      </main>

      <MiniFooter />
    </div>
  );
};

export default Shop;