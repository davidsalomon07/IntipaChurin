import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MiniFooter from '../components/MiniFooter'; // <-- Importamos el MiniFooter
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

// Íconos SVG para el Navbar
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

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
  const [cartOpen, setCartOpen] = useState(false);
  const { agregarAlCarrito} = useCart();
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
      
      {/* --- NAVBAR COMPLETO --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex justify-between items-center relative">
          
          <div className="hidden md:flex gap-8 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 flex-1 justify-start items-center">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Inicio</Link>
            
            <div className="relative group py-8">
              <span className="text-zinc-900 dark:text-zinc-100 cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors duration-300">
                Colecciones <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </span>
              <div className="absolute top-[60px] left-0 w-48 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Link to="/shop" className="block px-6 py-2 text-[12px] font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-100 dark:border-zinc-700 mb-1 pb-3">Catálogo Completo</Link>
                <Link to="/shop/hoodies" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Hoodies</Link>
                <Link to="/shop/camisetas" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Camisetas</Link>
                <Link to="/shop/pantalones" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Pantalones</Link>
              </div>
            </div>
            <Link to="/shop/nuevos" className="hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Nuevos</Link>
          </div>

          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 shrink-0 dark:text-white transition-colors duration-300">
            Intipa Churin
          </div>

          <div className="flex gap-6 text-zinc-600 dark:text-zinc-300 flex-1 justify-end">
            <button className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"><SearchIcon /></button>
            <Link to="/profile" className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"><UserIcon /></Link>
            <button className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110 relative">
              <CartIcon />
              <span className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- CONTENIDO DE LA TIENDA --- */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full">
        
        {/* Cabecera y Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-6 gap-4 relative transition-colors duration-300">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 dark:text-white">{tituloPagina}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">{productosFiltrados.length} productos encontrados</p>
          </div>
          
          {/* CUSTOM DROPDOWN PARA ORDENAR */}
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
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm text-zinc-900 dark:text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors shadow-lg"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1 transition-colors duration-300">{item.nombre}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold transition-colors duration-300">$ {item.precio.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
            No hay productos disponibles en esta categoría por el momento.
          </div>
        )}
      </main>

      <MiniFooter />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Shop;