import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniFooter from '../components/MiniFooter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M'); // Talla por defecto
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductoId = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProducto(data);
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    };

    fetchProductoId(true);

    // Consulta en tiempo real (polling cada 5 segundos)
    const interval = setInterval(() => {
      fetchProductoId(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-zinc-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <MiniFooter />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">La prenda que buscas no está disponible</h2>
          <p className="text-zinc-500 mb-6">Es posible que haya sido dada de baja o el enlace sea incorrecto.</p>
          <Link to="/shop" className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">Volver al catálogo</Link>
        </div>
        <MiniFooter />
      </div>
    );
  }

  // Mock de imágenes secundarias para la galería
  const imagenes = producto ? [
    producto.image_url || `https://placehold.co/800x1060/f5f5f4/d6d3d1?text=VISTA+1`,
    `https://placehold.co/800x1060/e5e5e5/a3a3a3?text=VISTA+2`,
    `https://placehold.co/800x1060/d4d4d4/737373?text=VISTA+3`,
    `https://placehold.co/800x1060/c4c4c4/525252?text=VISTA+4`,
    `https://placehold.co/800x1060/a3a3a3/404040?text=VISTA+5`,
  ] : [];

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Lado Izquierdo: Galería de Imágenes */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 md:pr-2 md:w-20 lg:w-24 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {imagenes.map((img, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative block p-0 w-16 md:w-full aspect-[3/4] shrink-0 rounded-2xl overflow-hidden transition-all duration-300 outline-none ${selectedImage === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="absolute inset-0 w-full h-full object-cover rounded-2xl" alt={`${producto.name} vista ${idx + 1}`} />
                  <div className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-colors duration-300 z-10 ${selectedImage === idx ? 'border-zinc-900 dark:border-white' : 'border-transparent'}`}></div>
                </button>
              ))}
            </div>

            {/* Imagen Principal */}
            <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm relative flex-grow">
              <img 
                src={imagenes[selectedImage]} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                alt={producto.name}
              />

              {/* 👇 NUEVO BOTÓN DE WISHLIST (Esquina Superior Derecha de la Imagen Principal) 👇 */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20">
                <button
                  type="button"
                  onClick={() => toggleWishlist(producto)}
                  title={isInWishlist(producto.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/90 backdrop-blur-sm hover:bg-white text-zinc-900 transition-all duration-300 hover:scale-110 dark:bg-zinc-900/90 dark:text-white dark:hover:bg-zinc-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" height="20"
                    viewBox="0 0 24 24"
                    fill={isInWishlist(producto.id) ? "#ef4444" : "none"}
                    stroke={isInWishlist(producto.id) ? "#ef4444" : "currentColor"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-colors duration-300"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              {/*  FIN DEL BOTÓN DE WISHLIST  */}

              <div className="absolute inset-0 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 pointer-events-none z-10"></div>
              {!producto.is_active && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-20">
                  <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-md">Agotado Temporalmente</span>
                </div>
              )}
            </div>
          </div>

          {/* Lado Derecho: Detalles */}
          <div className="flex flex-col h-full justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-2 block">
              {producto.category_name || 'Colección General'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 dark:text-white leading-tight">
              {producto.name}
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">
              $ {parseFloat(producto.price).toFixed(2)}
            </p>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 mb-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Descripción</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                {producto.description || "Esta prenda minimalista ha sido diseñada con altos estándares estructurales para adaptarse con total soltura a tu día a día, manteniendo la comodidad absoluta y la expresión libre de género."}
              </p>
            </div>

            {/* Selector de Tallas Simulado */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Seleccionar Talla</h2>
                <span className="text-xs text-zinc-400 font-medium">Calce Regular Unisex</span>
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((talla) => (
                  <button
                    key={talla}
                    disabled={!producto.is_active}
                    onClick={() => setTallaSeleccionada(talla)}
                    className={`w-12 h-12 rounded-xl text-xs font-bold border transition-all duration-200 ${!producto.is_active ? 'border-zinc-100 text-zinc-300 dark:border-zinc-900 dark:text-zinc-800 cursor-not-allowed' : tallaSeleccionada === talla ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-md scale-105' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'}`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado del Stock / Botón Compra */}
            <div className="space-y-4">
              <div className="text-xs flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${producto.stock_quantity > 5 ? 'bg-green-500' : producto.stock_quantity > 0 ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {producto.stock_quantity > 5 
                    ? `Disponibilidad inmediata (${producto.stock_quantity} unidades en stock)` 
                    : producto.stock_quantity > 0 
                      ? `¡Últimas ${producto.stock_quantity} unidades disponibles!` 
                      : 'Sin existencias en inventario'}
                </span>
              </div>

              <button
                disabled={!producto.is_active || producto.stock_quantity <= 0}
                onClick={() => agregarAlCarrito({
                  id: producto.id,
                  nombre: `${producto.name} (${tallaSeleccionada})`,
                  precio: parseFloat(producto.price),
                  categoria: producto.category_name,
                  imagen: producto.image_url,
                  stock_quantity: producto.stock_quantity
                })}
                className={`w-full py-4 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 ${(!producto.is_active || producto.stock_quantity <= 0) ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-700 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'}`}
              >
                {producto.stock_quantity > 0 ? 'Añadir al Carrito' : 'Agotado'}
              </button>
            </div>

          </div>
        </div>
      </main>

      <MiniFooter />
    </div>
  );
};

export default ProductDetail;