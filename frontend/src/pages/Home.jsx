import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useWishlist } from '../context/WishlistContext';

// Íconos SVG
const ShippingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
);
const ExchangeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21v-5h5"></path></svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
);
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
);
const ShirtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a8 8 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
);
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
);

const heroImages = [
  {
    src: "/carrusel/heo1.png",
    alt: "Colección Esencial",
    title: "HERO 1",
    fallback: "https://placehold.co/1920x1080/1a1a1a/ffffff?text=HERO+1"
  },
  {
    src: "/carrusel/heo2.png",
    alt: "Modelos Diversos",
    title: "HERO 2",
    fallback: "https://placehold.co/1920x1080/111111/ffffff?text=HERO+2"
  },
  {
    src: "/carrusel/heo3.png",
    alt: "Define tu estilo",
    title: "HERO 3",
    fallback: "https://placehold.co/1920x1080/0a0a0a/ffffff?text=HERO+3"
  },
];

const testimonials = [
  { text: "La calidad de las telas es increíble. Por fin una marca que entiende que el buen diseño no tiene género.", author: "Andrea V.", img: "https://placehold.co/100x100/1a1a1a/ffffff?text=AV" },
  { text: "El calce de los pantalones es perfecto. La experiencia de compra y el empaque se sienten totalmente premium.", author: "Mateo R.", img: "https://placehold.co/100x100/1a1a1a/ffffff?text=MR" },
  { text: "Piezas minimalistas que combinan con todo. Definitivamente mis nuevos básicos para el día a día.", author: "Sofía C.", img: "https://placehold.co/100x100/1a1a1a/ffffff?text=SC" },
  { text: "Excelente atención al cliente y las prendas llegaron súper rápido. Volveré a comprar.", author: "Luis F.", img: "https://placehold.co/100x100/1a1a1a/ffffff?text=LF" },
];
const categoryImages = {
  hoodies: "/categorias/hoodies.png",
  camisetas: "/categorias/camisetas.png",
  pantalones: "/categorias/pantalones.png",
  shorts: "/categorias/shorts.png",

  // Agrega aquí más categorías mapeándolas con su ruta en public
};

const Home = () => {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const itemsPerView = 3;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categoriasDB, setCategoriasDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catIndex, setCatIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);

  const intervalRef = useRef(null);

  // Lógica de arrastre y trackpad para carrusel de categorías
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef(null);
  const containerRef = useRef(null);
  const minSwipeDistance = 50;

  const handleDragStart = (clientX) => {
    touchStartRef.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || touchStartRef.current === null) return;
    let offset = clientX - touchStartRef.current;
    
    const stepSize = containerRef.current ? (containerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
    const limite = Math.max(0, categoriasDB.length - itemsPerView);
    
    // Bounds físicos reales del contenedor completo
    const maxDragRight = catIndex * stepSize;
    const maxDragLeft = -(limite - catIndex) * stepSize;
    
    if (offset > maxDragRight) offset = maxDragRight;
    if (offset < maxDragLeft) offset = maxDragLeft;
    
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || touchStartRef.current === null) return;
    setIsDragging(false);
    
    const stepSize = containerRef.current ? (containerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
    const limite = Math.max(0, categoriasDB.length - itemsPerView);
    
    // Calcular cuántos pasos completos hemos arrastrado
    let steps = Math.round(-dragOffset / stepSize);
    
    // Si no alcanzó un paso completo pero superó el mínimo, forzar al menos 1
    if (steps === 0) {
      if (dragOffset < -minSwipeDistance) steps = 1;
      if (dragOffset > minSwipeDistance) steps = -1;
    }
    
    setCatIndex(prev => Math.min(Math.max(0, limite), prev + steps));
    setDragOffset(0);
    touchStartRef.current = null;
  };

  const onTouchStart = (e) => handleDragStart(e.targetTouches[0].clientX);
  const onTouchMove = (e) => handleDragMove(e.targetTouches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  const onMouseDown = (e) => handleDragStart(e.clientX);
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => { if (isDragging) handleDragEnd(); };

  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef(null);

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setIsDragging(true);
      
      let newOffset = wheelAccumulator.current - e.deltaX;
      
      const stepSize = containerRef.current ? (containerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
      const limite = Math.max(0, categoriasDB.length - itemsPerView);
      
      const maxDragRight = catIndex * stepSize;
      const maxDragLeft = -(limite - catIndex) * stepSize;
      
      if (newOffset > maxDragRight) newOffset = maxDragRight;
      if (newOffset < maxDragLeft) newOffset = maxDragLeft;
      
      wheelAccumulator.current = newOffset;
      setDragOffset(wheelAccumulator.current);

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      
      wheelTimeout.current = setTimeout(() => {
        setIsDragging(false);
        const distance = wheelAccumulator.current;
        let steps = Math.round(-distance / stepSize);
        if (steps === 0) {
          if (distance < -minSwipeDistance) steps = 1;
          if (distance > minSwipeDistance) steps = -1;
        }
        setCatIndex(prev => Math.min(Math.max(0, limite), prev + steps));
        setDragOffset(0);
        wheelAccumulator.current = 0;
      }, 600);
    }
  };

  // Lógica de arrastre y trackpad para carrusel de testimonios
  const [testiDragOffset, setTestiDragOffset] = useState(0);
  const [isTestiDragging, setIsTestiDragging] = useState(false);
  const testiTouchStartRef = useRef(null);
  const testiContainerRef = useRef(null);

  const handleTestiDragStart = (clientX) => {
    testiTouchStartRef.current = clientX;
    setIsTestiDragging(true);
  };

  const handleTestiDragMove = (clientX) => {
    if (!isTestiDragging || testiTouchStartRef.current === null) return;
    let offset = clientX - testiTouchStartRef.current;
    
    const stepSize = testiContainerRef.current ? (testiContainerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
    const limite = Math.max(0, testimonials.length - itemsPerView);
    
    // Bounds físicos reales del contenedor completo
    const maxDragRight = testiIndex * stepSize;
    const maxDragLeft = -(limite - testiIndex) * stepSize;
    
    if (offset > maxDragRight) offset = maxDragRight;
    if (offset < maxDragLeft) offset = maxDragLeft;
    
    setTestiDragOffset(offset);
  };

  const handleTestiDragEnd = () => {
    if (!isTestiDragging || testiTouchStartRef.current === null) return;
    setIsTestiDragging(false);
    
    const stepSize = testiContainerRef.current ? (testiContainerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
    const limite = Math.max(0, testimonials.length - itemsPerView);
    
    // Calcular cuántos pasos completos hemos arrastrado
    let steps = Math.round(-testiDragOffset / stepSize);
    
    // Si no alcanzó un paso completo pero superó el mínimo, forzar al menos 1
    if (steps === 0) {
      if (testiDragOffset < -minSwipeDistance) steps = 1;
      if (testiDragOffset > minSwipeDistance) steps = -1;
    }
    
    setTestiIndex(prev => Math.min(Math.max(0, limite), prev + steps));
    setTestiDragOffset(0);
    testiTouchStartRef.current = null;
  };

  const onTestiTouchStart = (e) => handleTestiDragStart(e.targetTouches[0].clientX);
  const onTestiTouchMove = (e) => handleTestiDragMove(e.targetTouches[0].clientX);
  const onTestiTouchEnd = () => handleTestiDragEnd();

  const onTestiMouseDown = (e) => handleTestiDragStart(e.clientX);
  const onTestiMouseMove = (e) => handleTestiDragMove(e.clientX);
  const onTestiMouseUp = () => handleTestiDragEnd();
  const onTestiMouseLeave = () => { if (isTestiDragging) handleTestiDragEnd(); };

  const testiWheelAccumulator = useRef(0);
  const testiWheelTimeout = useRef(null);

  const onTestiWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setIsTestiDragging(true);
      
      let newOffset = testiWheelAccumulator.current - e.deltaX;
      
      const stepSize = testiContainerRef.current ? (testiContainerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
      const limite = Math.max(0, testimonials.length - itemsPerView);
      
      const maxDragRight = testiIndex * stepSize;
      const maxDragLeft = -(limite - testiIndex) * stepSize;
      
      if (newOffset > maxDragRight) newOffset = maxDragRight;
      if (newOffset < maxDragLeft) newOffset = maxDragLeft;
      
      testiWheelAccumulator.current = newOffset;
      setTestiDragOffset(testiWheelAccumulator.current);

      if (testiWheelTimeout.current) clearTimeout(testiWheelTimeout.current);
      
      testiWheelTimeout.current = setTimeout(() => {
        setIsTestiDragging(false);
        const distance = testiWheelAccumulator.current;
        let steps = Math.round(-distance / stepSize);
        if (steps === 0) {
          if (distance < -minSwipeDistance) steps = 1;
          if (distance > minSwipeDistance) steps = -1;
        }
        setTestiIndex(prev => Math.min(Math.max(0, limite), prev + steps));
        setTestiDragOffset(0);
        testiWheelAccumulator.current = 0;
      }, 600);
    }
  };

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 15000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, [startAutoPlay]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    startAutoPlay();
  }, [startAutoPlay]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch('http://localhost:3000/api/products'),
          fetch('http://localhost:3000/api/categories')
        ]);
        if (resProductos.ok) {
          const dataProductos = await resProductos.json();
          setProductosDestacados(dataProductos.slice(0, 4));
        }
        if (resCategorias.ok) {
          const dataCategorias = await resCategorias.json();
          setCategoriasDB(dataCategorias);
        }
      } catch (error) {
        console.error("Error al cargar datos del Home:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollTestimonialsLeft = () => {
    setTestiIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollTestimonialsRight = () => {
    const limite = testimonials.length - itemsPerView;
    setTestiIndex((prev) => Math.min(limite, prev + 1));
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-zinc-50 font-sans selection:bg-zinc-800 transition-colors duration-300 relative">
      <Navbar />

      {/* HERO SECTION - SPLIT LAYOUT */}
      <section className="pt-28 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="relative w-full h-auto min-h-[75vh] md:h-[80vh] rounded-[2rem] overflow-hidden group border border-white/10 bg-[#0e1014] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row w-full h-full">

            {/* Columna Izquierda - Texto */}
            <div className="w-full md:w-[45%] h-full flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 z-[2] order-2 md:order-1 relative">
              <div className="w-full max-w-md mx-auto">
                <span className="text-xs md:text-xs font-bold tracking-[0.3em] uppercase mb-4 text-white/70 block">
                  Colección Esencial 2026
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
                  Define tu estilo.
                </h1>
                <div className="w-16 h-[2px] bg-white/20 mb-6"></div>
                <p className="text-sm md:text-base font-light mb-10 text-white/60 leading-relaxed">
                  Siluetas modernas y versátiles. Diseñadas sin distinciones de
                  género para una comodidad absoluta y expresión libre.
                </p>
                <div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all duration-300"
                  >
                    Explorar colección <ArrowRightIcon />
                  </Link>
                </div>

                {/* Beneficios en Hero */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-6 sm:gap-4 justify-between items-start sm:items-center">
                  <div className="flex items-center gap-3 text-white/80">
                    <ShippingIcon />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">Envíos a todo Ecuador</span>
                    </div>
                  </div>
                  <div className="hidden sm:block w-[1px] h-8 bg-white/10"></div>
                  <div className="flex items-center gap-3 text-white/80">
                    <ExchangeIcon />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">Cambios y<br />devoluciones fáciles</span>
                    </div>
                  </div>
                  <div className="hidden sm:block w-[1px] h-8 bg-white/10"></div>
                  <div className="flex items-center gap-3 text-white/80">
                    <LockIcon />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">Pago 100%<br />seguro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="w-full md:w-[55%] h-[50vh] md:h-full relative order-1 md:order-2 overflow-hidden flex items-center justify-center bg-[#0e1014]">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={imgErrors[index] ? image.fallback : image.src}
                  alt={image.alt}
                  onError={() => setImgErrors((prev) => ({ ...prev, [index]: true }))}
                  className={`
                    absolute object-contain z-[2] max-w-[115%] max-h-[115%]
                    transition-all duration-1000 ease-in-out
                    ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                  `}
                />
              ))}
            </div>
          </div>

          {/* Controles Carrusel */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a imagen ${index + 1}`}
                className={`
                  rounded-full transition-all duration-500 ease-in-out
                  ${index === currentSlide
                    ? 'bg-white w-8 h-1.5'
                    : 'bg-white/30 w-1.5 h-1.5 hover:bg-white/60'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3 block">COMPRAR POR CATEGORÍA</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Encuentra tu estilo</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => setCatIndex(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
            <button onClick={() => { const limite = categoriasDB.length - itemsPerView; setCatIndex(prev => Math.min(Math.max(0, limite), prev + 1)); }} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div>

        <div className="overflow-hidden -my-24 py-24 -mx-6 px-6 md:-mx-12 md:px-12">
          {categoriasDB.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 w-full">
              <p>Estamos preparando las colecciones para ti.</p>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className={`flex w-full ${isDragging ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} gap-6`} 
              style={{ transform: `translateX(calc(-${catIndex} * (100% + 1.5rem) / ${itemsPerView} + ${dragOffset}px))` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
              onWheel={onWheel}
            >
              {categoriasDB.map((cat, index) => {
                const stepSize = containerRef.current ? (containerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
                const floatIndex = catIndex - (dragOffset / stepSize);
                
                const distFromLeft = index - floatIndex;
                const distFromRight = (floatIndex + itemsPerView - 1) - index;
                
                let progress = 1;
                if (distFromLeft < 0) {
                   progress = 1 + distFromLeft;
                } else if (distFromRight < 0) {
                   progress = 1 + distFromRight;
                }
                progress = Math.min(1, Math.max(0, progress));
                
                let opacityClass = "opacity-0 scale-95 pointer-events-none";
                let dynamicStyle = {};

                if (progress < 1 && progress > 0) {
                   dynamicStyle = { opacity: progress, transform: `scale(${0.95 + 0.05 * progress})`, pointerEvents: progress > 0.5 ? 'auto' : 'none' };
                } else if (progress === 1) {
                   opacityClass = "opacity-100 scale-100";
                   if (!(index >= catIndex && index < catIndex + itemsPerView)) {
                     dynamicStyle = { opacity: 1, transform: `scale(1)` };
                   }
                } else {
                   if (index >= catIndex && index < catIndex + itemsPerView) {
                     dynamicStyle = { opacity: 0, transform: `scale(0.95)`, pointerEvents: 'none' };
                   }
                }

                return (
                  <div
                    key={cat.id}
                    style={Object.keys(dynamicStyle).length > 0 ? dynamicStyle : undefined}
                    className={`carousel-card-item relative shadow-[0_24px_60px_rgba(0,0,0,0.6)] bg-[#0e1014] rounded-3xl border border-white/10 overflow-hidden flex flex-col transition-all ${Object.keys(dynamicStyle).length > 0 ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${Object.keys(dynamicStyle).length === 0 ? opacityClass : ''}`}
                  >
                    <div className="p-8 pb-0 z-10 h-[320px] flex flex-col">
                      <h3 className="text-3xl font-bold text-white mb-4">{cat.name}</h3>
                      <div className="w-8 h-[2px] bg-white/20 mb-6"></div>
                      <p className="text-sm text-zinc-400 max-w-[200px] mb-8 flex-grow">
                        {cat.name.toLowerCase() === 'hoodies' ? 'Comodidad y estilo en cada detalle. Perfectos para cualquier ocasión.' :
                          cat.name.toLowerCase() === 'camisetas' ? 'Diseños únicos en algodón premium. Ligereza y estilo que se sienten bien.' :
                            'Diseño, funcionalidad y comodidad para tu día a día.'}
                      </p>
                      <div className="pb-8">
                        <Link to={`/shop/${cat.name.toLowerCase()}`} className="inline-flex items-center gap-3 border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                          Ver {cat.name} <ArrowRightIcon />
                        </Link>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[60%] h-full flex items-center justify-end overflow-hidden pointer-events-none opacity-80">
                      <img
                        src={categoryImages[cat.name.toLowerCase()] || `https://placehold.co/800x1000/1a1a1a/ffffff?text=${cat.name.toUpperCase()}`}
                        className="w-full h-full object-cover translate-x-[10%]"
                        alt={cat.name}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* --- SELECCIÓN INICIAL --- */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3 block">SELECCIÓN INICIAL</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Nuevos esenciales.</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl">Piezas clave que definen tu estilo. Descubre lo más nuevo de la colección.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
              Ver catálogo completo <ArrowRightIcon />
            </Link>
            <div className="hidden md:flex gap-2">
              <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
              <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 flex justify-center text-zinc-400">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : productosDestacados.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500"><p>Próximamente nuevos ingresos.</p></div>
          ) : (
            productosDestacados.map((producto) => (
              <div key={producto.id} className="group cursor-pointer flex flex-col bg-[#0e1014] rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1" onClick={() => navigate(`/shop/producto/${producto.id}`)}>
                <div className="w-full aspect-[4/5] relative bg-[#0e1014] overflow-hidden flex items-center justify-center">
                  <img src={producto.image_url || `https://placehold.co/600x800/1a1a1a/ffffff?text=SIN+FOTO`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={producto.name} />

                  {/* Favoritos */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(producto); }}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isInWishlist(producto.id) ? "white" : "none"} stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-end">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1 truncate">{producto.name}</h3>
                    <p className="text-sm text-zinc-400">S/ {parseFloat(producto.price).toFixed(2)}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); agregarAlCarrito({ id: producto.id, nombre: producto.name, precio: parseFloat(producto.price), categoria: producto.category_name, imagen: producto.image_url, stock_quantity: producto.stock_quantity }); }} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5">
                    <BagIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- LANZAMIENTO EXCLUSIVO --- */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="bg-[#0e1014] rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <div className="w-full md:w-[38%] pt-8 pb-8 pl-8 pr-4 md:py-16 md:pl-16 md:pr-8 flex flex-col justify-center order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-full mb-8 self-start">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">LANZAMIENTO EXCLUSIVO</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-white">Trazabilidad &<br />Minimalismo</h2>
            <div className="w-12 h-[2px] bg-white/20 mb-6"></div>
            <p className="text-zinc-400 mb-10 leading-relaxed max-w-md text-sm md:text-base">Descubre nuestra primera línea de prendas estructuradas. Diseñadas en Quito, pensadas para adaptarse a cualquier estilo de vida sin perder la esencia.</p>

            <div className="mb-16">
              <Link to="/lookbook" className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
                Ver Lookbook <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="text-zinc-400"><LeafIcon /></div>
                <span className="text-xs text-zinc-400 leading-tight">Materiales<br />premium</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-zinc-400"><TargetIcon /></div>
                <span className="text-xs text-zinc-400 leading-tight">Diseño<br />atemporal</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-zinc-400"><ShirtIcon /></div>
                <span className="text-xs text-zinc-400 leading-tight">Hecho en<br />Ecuador</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[62%] h-[50vh] md:h-auto order-1 md:order-2 bg-[#0e1014] flex items-center justify-center pt-8 pb-8 pl-4 pr-8 md:py-16 md:pl-8 md:pr-16 relative min-h-[400px] md:min-h-0">
            <img src="/trazabilidad.png" className="w-full h-full max-h-[48vh] md:max-h-[70vh] object-contain rounded-2xl" alt="Lanzamiento" />
          </div>
        </div>
      </section>

      {/* --- COMUNIDAD --- */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-3 block">COMUNIDAD</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Lo que dice nuestra comunidad</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl">Miles de personas ya forman parte de Intipa Churin. Esto es lo que opinan sobre nuestra calidad y diseño.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={scrollTestimonialsLeft} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
            <button onClick={scrollTestimonialsRight} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-white hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div>

        <div className="overflow-hidden -my-8 py-8 -mx-6 px-6 md:-mx-12 md:px-12">
          <div
            ref={testiContainerRef}
            className={`flex w-full ${isTestiDragging ? '' : 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} gap-6`}
            style={{ transform: `translateX(calc(-${testiIndex} * (100% + 1.5rem) / ${itemsPerView} + ${testiDragOffset}px))` }}
            onTouchStart={onTestiTouchStart}
            onTouchMove={onTestiTouchMove}
            onTouchEnd={onTestiTouchEnd}
            onMouseDown={onTestiMouseDown}
            onMouseMove={onTestiMouseMove}
            onMouseUp={onTestiMouseUp}
            onMouseLeave={onTestiMouseLeave}
            onWheel={onTestiWheel}
          >
            {testimonials.map((testimonial, i) => {
              const stepSize = testiContainerRef.current ? (testiContainerRef.current.offsetWidth + 24) / itemsPerView : window.innerWidth / itemsPerView;
              const floatIndex = testiIndex - (testiDragOffset / stepSize);
              
              const distFromLeft = i - floatIndex;
              const distFromRight = (floatIndex + itemsPerView - 1) - i;
              
              let progress = 1;
              if (distFromLeft < 0) {
                 progress = 1 + distFromLeft;
              } else if (distFromRight < 0) {
                 progress = 1 + distFromRight;
              }
              progress = Math.min(1, Math.max(0, progress));
              
              let opacityClass = "opacity-0 scale-95 pointer-events-none";
              let dynamicStyle = {};

              if (progress < 1 && progress > 0) {
                 dynamicStyle = { opacity: progress, transform: `scale(${0.95 + 0.05 * progress})`, pointerEvents: progress > 0.5 ? 'auto' : 'none' };
              } else if (progress === 1) {
                 opacityClass = "opacity-100 scale-100";
                 if (!(i >= testiIndex && i < testiIndex + itemsPerView)) {
                   dynamicStyle = { opacity: 1, transform: `scale(1)` };
                 }
              } else {
                 if (i >= testiIndex && i < testiIndex + itemsPerView) {
                   dynamicStyle = { opacity: 0, transform: `scale(0.95)`, pointerEvents: 'none' };
                 }
              }

              return (
                <div
                  key={i}
                  style={Object.keys(dynamicStyle).length > 0 ? dynamicStyle : undefined}
                  className={`snap-start carousel-card-item bg-white/[0.02] backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between h-[280px] md:h-[260px] shrink-0 transition-all ${Object.keys(dynamicStyle).length > 0 ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${Object.keys(dynamicStyle).length === 0 ? opacityClass : ''}`}
                >
                  <div>
                    <div className="flex text-white mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (<svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>))}
                    </div>
                    <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed mb-8 line-clamp-4">"{testimonial.text}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.img} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover grayscale opacity-80" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{testimonial.author}</span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">Cliente verificado <CheckIcon /></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER (sin cambios) --- */}
      <footer className="bg-white dark:bg-zinc-950 pt-20 pb-0 px-6 md:px-12 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-400 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="text-xl font-bold tracking-widest uppercase mb-6 dark:text-white transition-colors duration-300">Intipa Churin</div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors duration-300">Moda contemporánea, inclusiva y transparente. Diseñada para trascender temporadas.</p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5.5 5" /></svg>
              </a>
              <a href="mailto:contacto@intipachurin.com" className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Enlaces</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Sobre la marca</Link></li>
              <li><Link to="/faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link to="/guide" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Guía de tallas</Link></li>
              <li><Link to="/shipping" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Envíos y devoluciones</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Políticas</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/shipping" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Aviso de Privacidad</Link></li>
              <li><Link to="/exchange" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Política de Cambios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Newsletter</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 transition-colors duration-300">Únete para recibir noticias sobre nuevos drops y ofertas exclusivas.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Tu correo electrónico" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-all dark:text-white dark:placeholder-zinc-500" />
              <button className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">Suscribirme</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto border-t border-zinc-100 dark:border-zinc-800 py-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium text-center md:text-left transition-colors duration-300">
            © 2026 Intipa Churin. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 pr-0 md:pr-24">
            <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 text-xs font-bold uppercase tracking-wider">
              Instagram
            </a>
            <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 text-xs font-bold uppercase tracking-wider">
              Tiktok
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;