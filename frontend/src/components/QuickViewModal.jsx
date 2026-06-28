import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const QuickViewModal = ({ isOpen, onClose, producto }) => {
  const { agregarAlCarrito } = useCart();
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !producto) return null;

  const handleAddToCart = () => {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.name,
      precio: parseFloat(producto.price),
      categoria: producto.category_name,
      imagen: producto.image_url,
      stock_quantity: producto.stock_quantity,
      talla: tallaSeleccionada
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300">
      {/* Overlay click para cerrar */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Contenedor Modal */}
      <div className="relative bg-white dark:bg-[#0e1014] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 scale-100 opacity-100 animate-in fade-in zoom-in-95">
        
        {/* Botón Cerrar Flotante */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-900 dark:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Lado Izquierdo: Imagen */}
        <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-[#151515] relative aspect-[4/5] md:aspect-auto">
          <img 
            src={producto.image_url || `https://placehold.co/600x800/1a1a1a/ffffff?text=SIN+FOTO`} 
            alt={producto.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {producto.original_price && parseFloat(producto.original_price) > parseFloat(producto.price) && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">
              -{Math.round((1 - parseFloat(producto.price) / parseFloat(producto.original_price)) * 100)}%
            </div>
          )}
        </div>

        {/* Lado Derecho: Detalles */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-2 block">
            {producto.category_name || 'Colección General'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white leading-tight">
            {producto.name}
          </h2>
          
          <div className="flex items-center gap-3 mb-6">
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              S/ {parseFloat(producto.price).toFixed(2)}
            </p>
            {producto.original_price && parseFloat(producto.original_price) > parseFloat(producto.price) && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium line-through">
                S/ {parseFloat(producto.original_price).toFixed(2)}
              </p>
            )}
          </div>

          <div className="w-12 h-[2px] bg-zinc-200 dark:bg-zinc-800 mb-6"></div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 line-clamp-3">
            {producto.description || "Esta prenda minimalista ha sido diseñada para adaptarse con total soltura a tu día a día, manteniendo la comodidad absoluta."}
          </p>

          {/* Tallas */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Talla</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL'].map((talla) => {
                const tieneStock = producto.sizes && producto.sizes.includes(talla);
                const isAvailable = producto.is_active && tieneStock;
                return (
                  <button
                    key={talla}
                    disabled={!isAvailable}
                    onClick={() => setTallaSeleccionada(talla)}
                    title={!tieneStock ? 'Sin stock' : `Seleccionar talla ${talla}`}
                    className={`relative w-10 h-10 rounded-lg text-xs font-bold border transition-all duration-200 overflow-hidden ${!isAvailable ? 'border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 cursor-default' : tallaSeleccionada === talla ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-md' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'}`}
                  >
                    {talla}
                    {!tieneStock && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[140%] h-px bg-zinc-300 dark:bg-zinc-600 -rotate-45 transform origin-center"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botón Añadir */}
          <button
            onClick={handleAddToCart}
            disabled={!producto.is_active}
            className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${producto.is_active ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5' : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {producto.is_active ? 'Añadir a la bolsa' : 'Agotado'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
