import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MiniFooter from '../components/MiniFooter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { agregarAlCarrito } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M'); // Talla por defecto
  const [selectedImage, setSelectedImage] = useState(0);
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [completaElLook, setCompletaElLook] = useState([]);

  // Estados para Gestos y Zoom
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [zoomProps, setZoomProps] = useState({ isZooming: false, x: 50, y: 50 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('description');

  const minSwipeDistance = 50;

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

  useEffect(() => {
    // Fetch para productos relacionados
    if (producto && producto.category_name) {
      const fetchRelacionados = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/products`);
          if (res.ok) {
            const data = await res.json();

            // Misma categoría (Productos Similares)
            const similares = data.filter(p => p.category_name === producto.category_name && p.id !== producto.id).slice(0, 4);
            setProductosSimilares(similares);

            // Diferente categoría (Completa el look)
            const diferentes = data.filter(p => p.category_name !== producto.category_name && p.is_active).slice(0, 4);
            setCompletaElLook(diferentes);
          }
        } catch (error) {
          console.error("Error cargando relacionados:", error);
        }
      };
      fetchRelacionados();
    }
  }, [producto?.category_name, producto?.id]);

  // Manejadores de Touch (Mobile)
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };
  const onTouchMove = (e) => {
    if (zoomProps.isZooming) {
      // Pan image with finger
      const currentX = e.targetTouches[0].clientX;
      const currentY = e.targetTouches[0].clientY;
      const deltaX = touchStart - currentX;
      const deltaY = touchStartY - currentY;
      
      setZoomProps(prev => ({
        ...prev,
        x: Math.min(100, Math.max(0, prev.x + (deltaX / 3))),
        y: Math.min(100, Math.max(0, prev.y + (deltaY / 3)))
      }));
      
      setTouchStart(currentX);
      setTouchStartY(currentY);
    } else {
      // Swipe gallery
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };
  const onTouchEnd = () => {
    if (zoomProps.isZooming) return; // Prevent swipe if zooming
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) setSelectedImage(prev => (prev === 4 ? 0 : prev + 1));
    if (distance < -minSwipeDistance) setSelectedImage(prev => (prev === 0 ? 4 : prev - 1));
  };

  // Double Click / Double Tap to Zoom (Desktop & Mobile)
  const handleClick = (e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick < 500 && timeSinceLastClick > 0) {
      // Es un doble clic / doble tap
      if (zoomProps.isZooming) {
        setZoomProps({ isZooming: false, x: 50, y: 50 });
      } else {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || e.nativeEvent.offsetX + left;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || e.nativeEvent.offsetY + top;
        const x = ((clientX - left) / width) * 100;
        const y = ((clientY - top) / height) * 100;
        setZoomProps({ isZooming: true, x, y });
      }
    }
    setLastClickTime(currentTime);
  };

  // Mouse pan for trackpads/mice while zoomed
  const handlePointerMove = (e) => {
    if (e.pointerType !== 'mouse' || !zoomProps.isZooming) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomProps(prev => ({ ...prev, x, y }));
  };

  // Manejador de Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: producto.name,
          text: `Mira esto en Intipa Churin: ${producto.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles', { position: 'bottom-center' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 flex flex-col justify-between transition-colors duration-300">
        <Navbar />
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Lado Izquierdo: Galería de Imágenes Esqueleto */}
            <div className="relative flex flex-col-reverse md:block w-full md:pl-24 lg:pl-30">
              {/* Thumbnails */}
              <div className="flex md:grid md:grid-rows-5 gap-3 overflow-hidden shrink-0 md:w-20 lg:w-24 md:absolute md:left-0 md:top-0 md:bottom-0 md:h-full">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="w-16 md:w-full md:h-full aspect-[3/4] md:aspect-auto rounded-2xl bg-zinc-200 dark:bg-zinc-800/50"></div>
                ))}
              </div>
              {/* Imagen Principal */}
              <div className="w-full aspect-[3/4] rounded-3xl bg-zinc-200 dark:bg-zinc-800/50"></div>
            </div>

            {/* Lado Derecho: Detalles Esqueleto */}
            <div className="flex flex-col h-full justify-center w-full">
              {/* Categoría */}
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/4 mb-4"></div>
              {/* Título */}
              <div className="h-10 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-3/4 mb-6"></div>
              {/* Precio */}
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/5 mb-10"></div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-6 mb-8">
                {/* Descripción label */}
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/6 mb-4"></div>
                {/* Descripción lineas */}
                <div className="space-y-3">
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-full"></div>
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-5/6"></div>
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800/50 rounded-full w-4/5"></div>
                </div>
              </div>

              {/* Tallas label */}
              <div className="mb-8">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/5 mb-4"></div>
                <div className="flex gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800/50"></div>
                  ))}
                </div>
              </div>

              {/* Stock status y botón */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800/50"></div>
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-2/3"></div>
                </div>
                <div className="w-full h-14 rounded-xl bg-zinc-300 dark:bg-zinc-700/80"></div>
              </div>
            </div>
          </div>
        </main>
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

  // Imágenes de la galería
  const baseImagenes = producto ? [
    producto.image_url,
    producto.image_url_2,
    producto.image_url_3,
    producto.image_url_4,
    producto.image_url_5,
  ].filter(Boolean) : [];

  // Garantizamos que siempre hayan 5 imágenes para mantener la alineación del diseño
  const imagenes = Array.from({ length: 5 }).map((_, i) => {
    if (baseImagenes.length > 0) {
      return baseImagenes[i] || baseImagenes[0]; // Rellenar con la imagen principal si faltan
    }
    return `https://placehold.co/800x1060/f5f5f4/d6d3d1?text=SIN+FOTO`;
  });

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-36 pb-24 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Lado Izquierdo: Galería de Imágenes */}
          <div className="relative flex flex-col-reverse md:block w-full md:pl-24 lg:pl-30">
            {/* Thumbnails */}
            <div className="flex md:grid md:grid-rows-5 gap-3 overflow-x-auto md:overflow-y-hidden pb-2 md:pb-0 md:w-20 lg:w-24 shrink-0 md:absolute md:left-0 md:top-0 md:bottom-0 md:h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {imagenes.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`relative block p-0 w-16 md:w-full md:h-full aspect-[3/4] md:aspect-auto shrink-0 rounded-2xl overflow-hidden transition-all duration-300 outline-none ${selectedImage === idx ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="absolute inset-0 w-full h-full object-cover rounded-2xl" alt={`${producto.name} vista ${idx + 1}`} />
                  <div className={`absolute inset-0 rounded-2xl border-2 pointer-events-none transition-colors duration-300 z-10 ${selectedImage === idx ? 'border-zinc-900 dark:border-white' : 'border-transparent'}`}></div>
                </button>
              ))}
            </div>

            {/* Imagen Principal */}
            <div
              className={`w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm relative flex-grow md:cursor-crosshair group ${zoomProps.isZooming ? 'touch-none' : 'touch-pan-y'}`}
              onPointerMove={handlePointerMove}
              onClick={handleClick}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={imagenes[selectedImage]}
                className={`absolute inset-0 w-full h-full transition-transform duration-300 md:duration-100 pointer-events-none ${zoomProps.isZooming ? 'scale-[2.5]' : 'scale-100 object-cover group-hover:scale-105'}`}
                style={zoomProps.isZooming ? { transformOrigin: `${zoomProps.x}% ${zoomProps.y}%` } : {}}
                alt={producto.name}
              />

              {/* 👇 BOTÓN DE WISHLIST Y SHARE 👇 */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex flex-col gap-2">
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

            {/* Migas de Pan (Breadcrumbs) y Compartir */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Inicio</Link>
                <span>/</span>
                <Link to="/shop" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Tienda</Link>
                <span>/</span>
                <span className="text-zinc-900 dark:text-zinc-300">{producto.category_name || 'Colección'}</span>
              </div>
              <button
                onClick={handleShare}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Compartir producto"
              >
                <Share2 size={18} />
              </button>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 dark:text-white leading-tight">
              {producto.name}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                S/ {parseFloat(producto.price).toFixed(2)}
              </p>
              {producto.original_price && parseFloat(producto.original_price) > parseFloat(producto.price) && (
                <div className="flex items-center gap-3">
                  <p className="text-lg md:text-xl text-zinc-400 dark:text-zinc-500 line-through">
                    S/ {parseFloat(producto.original_price).toFixed(2)}
                  </p>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    -{Math.round((1 - parseFloat(producto.price) / parseFloat(producto.original_price)) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mb-6">
              {/* Acordeón: Descripción */}
              <div className="border-b border-zinc-100 dark:border-zinc-800/80">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'description' ? '' : 'description')}
                  className="w-full py-4 flex justify-between items-center text-left transition-colors hover:text-zinc-600 dark:hover:text-zinc-400"
                >
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Descripción</h2>
                  {openAccordion === 'description' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'description' ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                    {producto.description || "Esta prenda minimalista ha sido diseñada con altos estándares estructurales para adaptarse con total soltura a tu día a día, manteniendo la comodidad absoluta y la expresión libre de género."}
                  </p>
                </div>
              </div>

              {/* Acordeón: Material & Cuidados */}
              <div className="border-b border-zinc-100 dark:border-zinc-800/80">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'material' ? '' : 'material')}
                  className="w-full py-4 flex justify-between items-center text-left transition-colors hover:text-zinc-600 dark:hover:text-zinc-400"
                >
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Material & Cuidados</h2>
                  {openAccordion === 'material' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'material' ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-light list-disc pl-4 space-y-1">
                    <li>100% Algodón Premium Orgánico.</li>
                    <li>Lavar a máquina en frío con colores similares.</li>
                    <li>No usar blanqueador. Secar en secadora a baja temperatura.</li>
                    <li>Planchar del revés si es necesario para cuidar el estampado.</li>
                  </ul>
                </div>
              </div>

              {/* Acordeón: Envíos */}
              <div className="border-b border-zinc-100 dark:border-zinc-800/80">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full py-4 flex justify-between items-center text-left transition-colors hover:text-zinc-600 dark:hover:text-zinc-400"
                >
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Envíos y Devoluciones</h2>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'shipping' ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                    Envío estándar gratuito en pedidos superiores a S/ 200. Las devoluciones son aceptadas dentro de los primeros 14 días desde la entrega siempre que la prenda se mantenga en su estado original con etiquetas.
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de Tallas */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Seleccionar Talla</h2>
                <span className="text-xs text-zinc-400 font-medium">Calce Regular Unisex</span>
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL'].map((talla) => {
                  const tieneStock = producto.sizes && producto.sizes.includes(talla);
                  const isAvailable = producto.is_active && tieneStock;
                  return (
                    <button
                      key={talla}
                      disabled={!isAvailable}
                      onClick={() => setTallaSeleccionada(talla)}
                      title={!tieneStock ? 'Sin stock' : `Seleccionar talla ${talla}`}
                      className={`relative w-12 h-12 rounded-xl text-xs font-bold border transition-all duration-200 overflow-hidden ${!isAvailable ? 'border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 cursor-default' : tallaSeleccionada === talla ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-md scale-105' : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500'}`}
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

        {/* Sección de Completa el look */}
        {completaElLook.length > 0 && (
          <div className="mt-24 pt-16 border-t border-zinc-200 dark:border-zinc-800/50">
            <h3 className="text-2xl font-bold tracking-tight mb-8 text-center text-zinc-900 dark:text-white">Completa el look</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {completaElLook.map(rel => (
                <Link key={rel.id} to={`/shop/producto/${rel.id}`} className="group block">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 relative">
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {!rel.is_active && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold px-2 py-1 bg-red-600 rounded">AGOTADO</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{rel.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">S/ {parseFloat(rel.price).toFixed(2)}</p>
                    {rel.original_price && parseFloat(rel.original_price) > parseFloat(rel.price) && (
                      <p className="text-xs text-zinc-400 line-through">S/ {parseFloat(rel.original_price).toFixed(2)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sección de Productos Similares */}
        {productosSimilares.length > 0 && (
          <div className="mt-16 pt-16 border-t border-zinc-200 dark:border-zinc-800/50">
            <h3 className="text-2xl font-bold tracking-tight mb-8 text-center text-zinc-900 dark:text-white">Productos Similares</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {productosSimilares.map(rel => (
                <Link key={rel.id} to={`/shop/producto/${rel.id}`} className="group block">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 relative">
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {!rel.is_active && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold px-2 py-1 bg-red-600 rounded">AGOTADO</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{rel.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">S/ {parseFloat(rel.price).toFixed(2)}</p>
                    {rel.original_price && parseFloat(rel.original_price) > parseFloat(rel.price) && (
                      <p className="text-xs text-zinc-400 line-through">S/ {parseFloat(rel.original_price).toFixed(2)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <MiniFooter />
    </div>
  );
};

export default ProductDetail;