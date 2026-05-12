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

  // Estados para el Custom Dropdown de Ordenar
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { agregarAlCarrito} = useCart();
  const [sortOption, setSortOption] = useState('Ordenar por: Destacados');
  const sortOptions = ['Ordenar por: Destacados', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor', 'Nuevos'];

  // Corrección del scroll
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
    <div className="bg-[#FCFCFC] min-h-screen text-stone-900 font-sans selection:bg-stone-200 flex flex-col">
      
      {/* --- NAVBAR COMPLETO --- */}
      <Navbar />

      {/* --- CONTENIDO DE LA TIENDA --- */}
      {/* Añadimos flex-grow para que el main empuje el footer hacia abajo si hay pocos productos */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full">
        
        {/* Cabecera y Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-100 pb-6 gap-4 relative">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{tituloPagina}</h1>
            <p className="text-stone-500 text-sm">{productosFiltrados.length} productos encontrados</p>
          </div>
          
          {/* CUSTOM DROPDOWN PARA ORDENAR */}
          <div className="relative">
            {/* Botón que simula el select */}
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              onBlur={() => setTimeout(() => setIsSortOpen(false), 200)} // Se cierra si das clic fuera
              className="flex items-center justify-between gap-3 bg-transparent border border-stone-200 text-stone-600 text-sm rounded-full px-5 py-2 hover:border-stone-400 transition-colors focus:outline-none min-w-[220px]"
            >
              <span>{sortOption}</span>
              <svg className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {/* Lista de opciones desplegable */}
            <div className={`absolute top-full right-0 mt-2 w-full min-w-[220px] bg-white border border-stone-100 shadow-xl rounded-2xl py-2 z-20 origin-top-right transition-all duration-200 ${isSortOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              {sortOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSortOption(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${sortOption === option ? 'font-bold text-stone-900 bg-stone-50' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}
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
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 mb-5 relative">
                  <img 
                    src={`https://placehold.co/600x800/f5f5f4/d6d3d1?text=${item.categoria.toUpperCase()}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={item.nombre}
                  />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <button
                      onClick={() => agregarAlCarrito(item)}
                      className="w-full bg-white/95 backdrop-blur-sm text-stone-900 py-3 rounded-xl text-sm font-semibold hover:bg-stone-900 hover:text-white transition-colors shadow-lg"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-stone-800 mb-1">{item.nombre}</h3>
                <p className="text-sm text-stone-500 font-semibold">$ {item.precio.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-stone-500">
            No hay productos disponibles en esta categoría por el momento.
          </div>
        )}
      </main>

      {/* --- MINI FOOTER --- */}
      <MiniFooter />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Shop;