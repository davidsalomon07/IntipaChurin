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

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerView = isMobile ? 2 : 3;
  const prodItemsPerView = isMobile ? 2 : 4;

  const getStepSize = (ref, defaultItems) => {
    return ref.current ? (ref.current.offsetWidth + 24) / defaultItems : window.innerWidth / defaultItems;
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categoriasDB, setCategoriasDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catIndex, setCatIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  const [prodIndex, setProdIndex] = useState(0);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const intervalRef = useRef(null);
  const heroContainerRef = useRef(null);
  const isTransitioningRef = useRef(false);

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

    const stepSize = getStepSize(containerRef, itemsPerView);
    const limite = Math.max(0, categoriasDB.length - itemsPerView);

    // Bounds físicos reales con efecto de resistencia elástica
    const maxDragRight = catIndex * stepSize;
    const maxDragLeft = -(limite - catIndex) * stepSize;

    if (offset > maxDragRight) offset = maxDragRight;
    if (offset < maxDragLeft) offset = maxDragLeft;

    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || touchStartRef.current === null) return;
    setIsDragging(false);

    const stepSize = getStepSize(containerRef, itemsPerView);
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
      e.preventDefault();
      setIsDragging(true);

      let newOffset = wheelAccumulator.current - e.deltaX;

      const stepSize = getStepSize(containerRef, itemsPerView);
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

    const stepSize = getStepSize(testiContainerRef, itemsPerView);
    const limite = Math.max(0, testimonials.length - itemsPerView);

    // Bounds físicos reales con efecto de resistencia elástica
    const maxDragRight = testiIndex * stepSize;
    const maxDragLeft = -(limite - testiIndex) * stepSize;

    if (offset > maxDragRight) offset = maxDragRight;
    if (offset < maxDragLeft) offset = maxDragLeft;

    setTestiDragOffset(offset);
  };

  const handleTestiDragEnd = () => {
    if (!isTestiDragging || testiTouchStartRef.current === null) return;
    setIsTestiDragging(false);

    const stepSize = getStepSize(testiContainerRef, itemsPerView);
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
      e.preventDefault();
      setIsTestiDragging(true);

      let newOffset = testiWheelAccumulator.current - e.deltaX;

      const stepSize = getStepSize(testiContainerRef, itemsPerView);
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

  // Lógica de arrastre y trackpad para carrusel de productos (Nuevos Esenciales)
  const [prodDragOffset, setProdDragOffset] = useState(0);
  const [isProdDragging, setIsProdDragging] = useState(false);
  const prodTouchStartRef = useRef(null);
  const prodContainerRef = useRef(null);

  const handleProdDragStart = (clientX) => {
    prodTouchStartRef.current = clientX;
    setIsProdDragging(true);
  };

  const handleProdDragMove = (clientX) => {
    if (!isProdDragging || prodTouchStartRef.current === null) return;
    let offset = clientX - prodTouchStartRef.current;

    const stepSize = getStepSize(prodContainerRef, prodItemsPerView);
    const limite = Math.max(0, productosDestacados.length - prodItemsPerView);

    // Bounds físicos reales con efecto de resistencia elástica
    const maxDragRight = prodIndex * stepSize;
    const maxDragLeft = -(limite - prodIndex) * stepSize;

    if (offset > maxDragRight) offset = maxDragRight;
    if (offset < maxDragLeft) offset = maxDragLeft;

    setProdDragOffset(offset);
  };

  const handleProdDragEnd = () => {
    if (!isProdDragging || prodTouchStartRef.current === null) return;
    setIsProdDragging(false);

    const stepSize = getStepSize(prodContainerRef, prodItemsPerView);
    const limite = Math.max(0, productosDestacados.length - prodItemsPerView);

    // Calcular cuántos pasos completos hemos arrastrado
    let steps = Math.round(-prodDragOffset / stepSize);

    // Si no alcanzó un paso completo pero superó el mínimo, forzar al menos 1
    if (steps === 0) {
      if (prodDragOffset < -minSwipeDistance) steps = 1;
      if (prodDragOffset > minSwipeDistance) steps = -1;
    }

    setProdIndex(prev => Math.min(Math.max(0, limite), prev + steps));
    setProdDragOffset(0);
    prodTouchStartRef.current = null;
  };

  const onProdTouchStart = (e) => handleProdDragStart(e.targetTouches[0].clientX);
  const onProdTouchMove = (e) => handleProdDragMove(e.targetTouches[0].clientX);
  const onProdTouchEnd = () => handleProdDragEnd();

  const onProdMouseDown = (e) => handleProdDragStart(e.clientX);
  const onProdMouseMove = (e) => handleProdDragMove(e.clientX);
  const onProdMouseUp = () => handleProdDragEnd();
  const onProdMouseLeave = () => { if (isProdDragging) handleProdDragEnd(); };

  const prodWheelAccumulator = useRef(0);
  const prodWheelTimeout = useRef(null);

  const onProdWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      setIsProdDragging(true);

      let newOffset = prodWheelAccumulator.current - e.deltaX;

      const stepSize = getStepSize(prodContainerRef, prodItemsPerView);
      const limite = Math.max(0, productosDestacados.length - prodItemsPerView);

      const maxDragRight = prodIndex * stepSize;
      const maxDragLeft = -(limite - prodIndex) * stepSize;

      if (newOffset > maxDragRight) newOffset = maxDragRight;
      if (newOffset < maxDragLeft) newOffset = maxDragLeft;

      prodWheelAccumulator.current = newOffset;
      setProdDragOffset(prodWheelAccumulator.current);

      if (prodWheelTimeout.current) clearTimeout(prodWheelTimeout.current);

      prodWheelTimeout.current = setTimeout(() => {
        setIsProdDragging(false);
        const distance = prodWheelAccumulator.current;
        let steps = Math.round(-distance / stepSize);
        if (steps === 0) {
          if (distance < -minSwipeDistance) steps = 1;
          if (distance > minSwipeDistance) steps = -1;
        }
        setProdIndex(prev => Math.min(Math.max(0, limite), prev + steps));
        setProdDragOffset(0);
        prodWheelAccumulator.current = 0;
      }, 600);
    }
  };

  const categoryHandlersRef = useRef(null);
  categoryHandlersRef.current = { handleDragStart, handleDragMove, handleDragEnd };

  const testiHandlersRef = useRef(null);
  testiHandlersRef.current = { handleTestiDragStart, handleTestiDragMove, handleTestiDragEnd };

  const prodHandlersRef = useRef(null);
  prodHandlersRef.current = { handleProdDragStart, handleProdDragMove, handleProdDragEnd };

  // Categories native touch listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouchDragging = true;
      categoryHandlersRef.current.handleDragStart(touchStartX);
    };

    const handleTouchMove = (e) => {
      if (!isTouchDragging) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX;
      const diffY = currentY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) e.preventDefault();
        categoryHandlersRef.current.handleDragMove(currentX);
      } else {
        isTouchDragging = false;
        categoryHandlersRef.current.handleDragEnd();
      }
    };

    const handleTouchEnd = () => {
      if (isTouchDragging) {
        isTouchDragging = false;
        categoryHandlersRef.current.handleDragEnd();
      }
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef.current]);

  // Testimonials native touch listeners
  useEffect(() => {
    const container = testiContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouchDragging = true;
      testiHandlersRef.current.handleTestiDragStart(touchStartX);
    };

    const handleTouchMove = (e) => {
      if (!isTouchDragging) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX;
      const diffY = currentY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) e.preventDefault();
        testiHandlersRef.current.handleTestiDragMove(currentX);
      } else {
        isTouchDragging = false;
        testiHandlersRef.current.handleTestiDragEnd();
      }
    };

    const handleTouchEnd = () => {
      if (isTouchDragging) {
        isTouchDragging = false;
        testiHandlersRef.current.handleTestiDragEnd();
      }
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [testiContainerRef.current]);

  // Products native touch listeners
  useEffect(() => {
    const container = prodContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTouchDragging = true;
      prodHandlersRef.current.handleProdDragStart(touchStartX);
    };

    const handleTouchMove = (e) => {
      if (!isTouchDragging) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartX;
      const diffY = currentY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) e.preventDefault();
        prodHandlersRef.current.handleProdDragMove(currentX);
      } else {
        isTouchDragging = false;
        prodHandlersRef.current.handleProdDragEnd();
      }
    };

    const handleTouchEnd = () => {
      if (isTouchDragging) {
        isTouchDragging = false;
        prodHandlersRef.current.handleProdDragEnd();
      }
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [prodContainerRef.current]);

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

  const handleHeroPrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentSlide(prev => (prev - 1 + heroImages.length) % heroImages.length);
    startAutoPlay();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  }, [startAutoPlay]);

  const handleHeroNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentSlide(prev => (prev + 1) % heroImages.length);
    startAutoPlay();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 1000);
  }, [startAutoPlay]);

  useEffect(() => {
    const container = heroContainerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isDraggingHero = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDraggingHero = true;
    };

    const onTouchMove = (e) => {
      if (!isDraggingHero) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (e.cancelable) e.preventDefault();
        isDraggingHero = false;
        if (diffX > 0) {
          handleHeroPrev();
        } else {
          handleHeroNext();
        }
      }
    };

    const onTouchEnd = () => {
      isDraggingHero = false;
    };

    const onMouseDown = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      startX = e.clientX;
      startY = e.clientY;
      isDraggingHero = true;
    };

    const onMouseMove = (e) => {
      if (!isDraggingHero) return;
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        isDraggingHero = false;
        if (diffX > 0) {
          handleHeroPrev();
        } else {
          handleHeroNext();
        }
      }
    };

    const onMouseUp = () => {
      isDraggingHero = false;
    };

    let wheelAccumulator = 0;
    let wheelTimeout = null;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        wheelAccumulator += e.deltaX;

        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          wheelAccumulator = 0;
        }, 150);

        if (Math.abs(wheelAccumulator) > 50) {
          const right = wheelAccumulator > 0;
          wheelAccumulator = 0;
          if (right) {
            handleHeroNext();
          } else {
            handleHeroPrev();
          }
        }
      } else {
        wheelAccumulator = 0;
      }
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    container.addEventListener('mousedown', onMouseDown, { passive: true });
    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseup', onMouseUp, { passive: true });
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('mousedown', onMouseDown);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [handleHeroPrev, handleHeroNext]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resCategorias] = await Promise.all([
          fetch('http://localhost:3000/api/products'),
          fetch('http://localhost:3000/api/categories')
        ]);
        if (resProductos.ok) {
          const dataProductos = await resProductos.json();
          setProductosDestacados(dataProductos.slice(0, 8));
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
    <div className="bg-[#FCFCFC] dark:bg-[#0a0a0a] min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300 relative">
      <Navbar />

      {/* HERO SECTION - SPLIT LAYOUT */}
      <section className="pt-20 md:pt-28 pb-6 md:pb-12 px-4 md:px-12 max-w-[1600px] mx-auto">
        <div ref={heroContainerRef} className="relative w-full h-auto min-h-[auto] md:h-[80vh] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0e1014] shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row w-full h-full">

            {/* Columna Izquierda - Texto */}
            <div className="w-full md:w-[45%] h-auto md:h-full flex flex-col justify-center px-6 md:px-16 py-8 md:py-0 z-[2] order-2 md:order-1 relative">
              <div className="w-full max-w-md mx-auto">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-3 md:mb-4 text-zinc-500 dark:text-white/70 block text-center md:text-left">
                  Colección Esencial 2026
                </span>
                <h1 className="text-3xl md:text-7xl font-bold tracking-tight mb-3 md:mb-6 text-zinc-900 dark:text-white leading-tight text-center md:text-left">
                  Define tu estilo.
                </h1>
                <div className="w-12 md:w-16 h-[2px] bg-zinc-200 dark:bg-white/20 mb-4 md:mb-6 mx-auto md:mx-0"></div>
                <p className="text-xs md:text-base font-light mb-6 md:mb-10 text-zinc-600 dark:text-white/60 leading-relaxed text-center md:text-left">
                  Siluetas modernas y versátiles. Diseñadas sin distinciones de género para una comodidad absoluta y expresión libre.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 md:gap-3 bg-zinc-900 text-white dark:bg-white dark:text-black px-6 md:px-8 py-3 md:py-4 rounded-full text-xs md:text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Explorar colección <ArrowRightIcon />
                  </Link>
                </div>

                {/* Beneficios en Hero */}
                <div className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-row flex-wrap justify-center md:justify-between items-center gap-y-4 gap-x-6 md:gap-x-0 w-full">
                  <div className="flex items-center gap-2 md:gap-3 text-zinc-700 dark:text-white/80">
                    <ShippingIcon />
                    <span className="text-[10px] md:text-xs font-semibold leading-tight text-left">Envíos a todo Chile</span>
                  </div>
                  <div className="hidden md:block w-[1px] h-8 bg-zinc-200 dark:bg-white/10"></div>
                  <div className="flex items-center gap-2 md:gap-3 text-zinc-700 dark:text-white/80">
                    <ExchangeIcon />
                    <span className="text-[10px] md:text-xs font-semibold leading-tight text-left">Cambios fáciles</span>
                  </div>
                  <div className="hidden md:block w-[1px] h-8 bg-zinc-200 dark:bg-white/10"></div>
                  <div className="flex items-center gap-2 md:gap-3 text-zinc-700 dark:text-white/80">
                    <LockIcon />
                    <span className="text-[10px] md:text-xs font-semibold leading-tight text-left">Pago 100% seguro</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="w-full md:w-[55%] h-[35vh] md:h-full relative order-1 md:order-2 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-[#0e1014]">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={imgErrors[index] ? image.fallback : image.src}
                  alt={image.alt}
                  onError={() => setImgErrors((prev) => ({ ...prev, [index]: true }))}
                  className={`
                    absolute object-contain z-[2] max-w-[115%] max-h-[115%]
                    transition-all duration-1000 ease-in-out
                    ${index === currentSlide ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 pointer-events-none'}
                    ${index === (currentSlide - 1 + heroImages.length) % heroImages.length ? '-translate-x-[20%]' : ''}
                    ${index === (currentSlide + 1) % heroImages.length ? 'translate-x-[20%]' : ''}
                  `}
                />
              ))}

              {/* Controles Carrusel para Mobile */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex md:hidden items-center gap-2 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                    className={`
                      rounded-full transition-all duration-500 ease-in-out
                      ${index === currentSlide
                        ? 'bg-white w-8 h-1.5'
                        : 'bg-white/40 w-1.5 h-1.5 hover:bg-white/60'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Controles Carrusel para Escritorio */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] hidden md:flex items-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a imagen ${index + 1}`}
                className={`
                  rounded-full transition-all duration-500 ease-in-out
                  ${index === currentSlide
                    ? 'bg-zinc-900 dark:bg-white w-8 h-1.5'
                    : 'bg-zinc-300 dark:bg-white/30 w-1.5 h-1.5 hover:bg-zinc-400 dark:hover:bg-white/60'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS --- */}
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-6 text-center md:text-left">
          <div className="w-full">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 md:mb-3 block text-center md:text-left">COMPRAR POR CATEGORÍA</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-0 text-center md:text-left">Encuentra tu estilo</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => setCatIndex(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
            <button onClick={() => { const limite = categoriasDB.length - itemsPerView; setCatIndex(prev => Math.min(Math.max(0, limite), prev + 1)); }} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div>

        <div className="overflow-hidden -my-12 py-12 md:-my-24 md:py-24 -mx-6 px-6 md:-mx-12 md:px-12">
          {categoriasDB.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 w-full">
              <p>Estamos preparando las colecciones para ti.</p>
            </div>
          ) : (
            <div
              ref={containerRef}
              className={`flex w-full touch-pan-y transition-transform ease-[cubic-bezier(0.25,1,0.5,1)] ${isDragging ? 'duration-0' : 'duration-700'} gap-6`}
              style={{ transform: `translateX(calc(-${catIndex} * (100% + 1.5rem) / ${itemsPerView} + ${dragOffset}px))` }}
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
                    className={`carousel-card-item relative shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)] bg-white dark:bg-[#0e1014] rounded-2xl md:rounded-3xl border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col transition-all ${Object.keys(dynamicStyle).length > 0 ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${Object.keys(dynamicStyle).length === 0 ? opacityClass : ''}`}
                  >
                    {/* Contenido en móvil (apilado: título -> imagen -> botón) */}
                    <div className="flex md:hidden flex-col items-center justify-between p-4 h-[260px] w-full text-center">
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1.5">{cat.name}</h3>
                        <div className="w-6 h-[2px] bg-zinc-200 dark:bg-white/20"></div>
                      </div>
                      
                      <div className="w-full h-[145px] flex items-center justify-center overflow-hidden pointer-events-none my-1">
                        <img
                          src={categoryImages[cat.name.toLowerCase()] || `https://placehold.co/800x1000/1a1a1a/ffffff?text=${cat.name.toUpperCase()}`}
                          className="max-w-full max-h-full object-contain"
                          alt={cat.name}
                        />
                      </div>

                      <div className="w-full flex justify-center">
                        <Link to={`/shop/${cat.name.toLowerCase()}`} className="inline-flex items-center justify-center w-auto whitespace-nowrap gap-1.5 border border-zinc-200 dark:border-white/20 text-zinc-800 dark:text-white px-4 py-2 rounded-full text-[11px] font-medium bg-white/80 dark:bg-transparent backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
                          Ver {cat.name}
                        </Link>
                      </div>
                    </div>

                    {/* Contenido en escritorio (diseño clásico side-by-side) */}
                    <div className="hidden md:flex p-8 pb-0 z-10 h-[320px] flex-col pointer-events-none">
                      <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{cat.name}</h3>
                      <div className="w-8 h-[2px] bg-zinc-200 dark:bg-white/20 mb-6"></div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[200px] mb-8 flex-grow">
                        {cat.name.toLowerCase() === 'hoodies' ? 'Comodidad y estilo en cada detail. Perfectos para cualquier ocasión.' :
                          cat.name.toLowerCase() === 'camisetas' ? 'Diseños únicos en algodón premium. Ligereza y estilo que se sienten bien.' :
                            'Diseño, funcionalidad y comodidad para tu día a día.'}
                      </p>
                      <div className="pb-8 pointer-events-auto relative z-20 flex justify-start">
                        <Link to={`/shop/${cat.name.toLowerCase()}`} className="inline-flex items-center justify-center w-auto gap-3 border border-zinc-200 dark:border-white/20 text-zinc-800 dark:text-white px-6 py-2.5 rounded-full text-sm font-medium bg-white/80 dark:bg-transparent backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors">
                          Ver {cat.name} <span className="inline-flex"><ArrowRightIcon /></span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Imagen de escritorio */}
                    <div className="hidden md:flex absolute top-0 right-0 w-[60%] h-full items-end justify-end overflow-hidden pointer-events-none opacity-80">
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
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-6 text-center md:text-left">
          <div className="w-full">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 md:mb-3 block text-center md:text-left">SELECCIÓN INICIAL</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 md:mb-4 text-center md:text-left">Nuevos esenciales.</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-xl mx-auto md:mx-0 text-center md:text-left">Piezas clave que definen tu estilo. Descubre lo más nuevo de la colección.</p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
            <Link to="/shop" className="border border-zinc-200 dark:border-white/20 text-zinc-800 dark:text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-auto whitespace-nowrap">
              Ver catálogo completo <ArrowRightIcon />
            </Link>
            <div className="hidden md:flex gap-2">
              <button onClick={() => setProdIndex(prev => Math.max(0, prev - 1))} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
              <button onClick={() => { const limite = productosDestacados.length - prodItemsPerView; setProdIndex(prev => Math.min(Math.max(0, limite), prev + 1)); }} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden -my-12 py-12 md:-my-24 md:py-24 -mx-6 px-6 md:-mx-12 md:px-12">
          {isLoading ? (
            <div className="flex w-full gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="product-card-item flex flex-col animate-pulse bg-white dark:bg-[#0e1014] rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                  <div className="w-full aspect-[4/5] bg-zinc-200 dark:bg-zinc-800/50"></div>
                  <div className="p-5 flex justify-between items-end">
                    <div className="w-3/4">
                      <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700/80 rounded-full w-2/3 mb-3"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800/80 rounded-full w-1/3"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800/80"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosDestacados.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500"><p>Próximamente nuevos ingresos.</p></div>
          ) : (
            <div
              ref={prodContainerRef}
              className={`flex w-full touch-pan-y transition-transform ease-[cubic-bezier(0.25,1,0.5,1)] ${isProdDragging ? 'duration-0' : 'duration-700'} gap-6`}
              style={{ transform: `translateX(calc(-${prodIndex} * (100% + 1.5rem) / ${prodItemsPerView} + ${prodDragOffset}px))` }}
              onMouseDown={onProdMouseDown}
              onMouseMove={onProdMouseMove}
              onMouseUp={onProdMouseUp}
              onMouseLeave={onProdMouseLeave}
              onWheel={onProdWheel}
            >
              {productosDestacados.map((producto, index) => {
                const stepSize = prodContainerRef.current ? (prodContainerRef.current.offsetWidth + 24) / prodItemsPerView : window.innerWidth / prodItemsPerView;
                const floatIndex = prodIndex - (prodDragOffset / stepSize);

                const distFromLeft = index - floatIndex;
                const distFromRight = (floatIndex + prodItemsPerView - 1) - index;

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
                  if (!(index >= prodIndex && index < prodIndex + prodItemsPerView)) {
                    dynamicStyle = { opacity: 1, transform: `scale(1)` };
                  }
                } else {
                  if (index >= prodIndex && index < prodIndex + prodItemsPerView) {
                    dynamicStyle = { opacity: 0, transform: `scale(0.95)`, pointerEvents: 'none' };
                  }
                }

                return (
                  <div
                    key={producto.id}
                    style={Object.keys(dynamicStyle).length > 0 ? dynamicStyle : undefined}
                    className={`product-card-item group cursor-pointer flex flex-col bg-white dark:bg-[#0e1014] rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-all ${Object.keys(dynamicStyle).length > 0 ? 'duration-0' : 'duration-300 hover:-translate-y-1'} ${Object.keys(dynamicStyle).length === 0 ? opacityClass : ''} shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]`}
                    onClick={() => navigate(`/shop/producto/${producto.id}`)}
                    onMouseEnter={() => setHoveredProductId(producto.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <div className="w-full aspect-[4/5] relative bg-zinc-50 dark:bg-[#0e1014] overflow-hidden flex items-center justify-center">
                      <img
                        src={producto.image_url || `https://placehold.co/600x800/1a1a1a/ffffff?text=SIN+FOTO`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-100"
                        alt={producto.name}
                      />
                      {producto.image_url_2 && (
                        <img
                          src={producto.image_url_2}
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${hoveredProductId === producto.id ? 'opacity-100' : 'opacity-0'}`}
                          alt={`${producto.name} vista trasera`}
                        />
                      )}

                      {/* Etiqueta de Descuento */}
                      {producto.original_price && parseFloat(producto.original_price) > parseFloat(producto.price) && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">
                          -{Math.round((1 - parseFloat(producto.price) / parseFloat(producto.original_price)) * 100)}%
                        </div>
                      )}

                      {/* Favoritos */}
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(producto); }}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md text-white hover:bg-black/60 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={isInWishlist(producto.id) ? "white" : "none"} stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>
                      </div>

                      {/* Botón Añadir al carrito (Glassmorphism + Icon) */}
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); agregarAlCarrito({ id: producto.id, nombre: producto.name, precio: parseFloat(producto.price), categoria: producto.category_name, imagen: producto.image_url, stock_quantity: producto.stock_quantity }); }}
                          className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-zinc-950/40 backdrop-blur-md hover:bg-zinc-950/60 flex items-center justify-center text-white transition-colors border border-white/10 shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[20px] md:h-[20px]"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 md:p-5 flex flex-col items-start text-left bg-white dark:bg-[#0e1014]">
                      <h3 className="text-[11px] md:text-sm font-semibold text-zinc-900 dark:text-white mb-1 truncate w-full">{producto.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        <p className="text-[11px] md:text-sm text-zinc-900 dark:text-white font-bold">S/ {parseFloat(producto.price).toFixed(2)}</p>
                        {producto.original_price && parseFloat(producto.original_price) > parseFloat(producto.price) && (
                          <p className="text-[9px] md:text-xs text-zinc-400 dark:text-zinc-500 line-through">S/ {parseFloat(producto.original_price).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* --- LANZAMIENTO EXCLUSIVO --- */}
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="bg-white dark:bg-[#0e1014] rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
          <div className="w-full md:w-[38%] p-6 py-8 md:py-16 md:pl-16 md:pr-8 flex flex-col justify-center order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-zinc-200 dark:border-white/10 px-4 py-1.5 rounded-full mb-6 md:mb-8 self-center md:self-start">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">LANZAMIENTO EXCLUSIVO</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-zinc-900 dark:text-white text-center md:text-left">Trazabilidad &<br />Minimalismo</h2>
            <div className="w-12 h-[2px] bg-zinc-200 dark:bg-white/20 mb-6 mx-auto md:mx-0"></div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 md:mb-10 leading-relaxed max-w-md text-sm md:text-base text-center md:text-left mx-auto md:mx-0">Descubre nuestra primera línea de prendas estructuradas. Diseñadas en Quito, pensadas para adaptarse a cualquier estilo de vida sin perder la esencia.</p>

            <div className="mb-10 md:mb-16 flex justify-center md:justify-start">
              <Link to="/lookbook" className="inline-flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-black px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                Ver Lookbook <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 border-t border-zinc-200 dark:border-white/10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-zinc-500 dark:text-zinc-400"><LeafIcon /></div>
                <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight">Materiales<br className="hidden sm:inline" />premium</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-zinc-500 dark:text-zinc-400"><TargetIcon /></div>
                <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight">Diseño<br className="hidden sm:inline" />atemporal</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
                <div className="text-zinc-500 dark:text-zinc-400"><ShirtIcon /></div>
                <span className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400 leading-tight">Hecho en<br className="hidden sm:inline" />Chile</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[62%] h-[28vh] min-h-[220px] md:h-auto order-1 md:order-2 bg-zinc-50 dark:bg-[#0e1014] flex items-center justify-center p-4 md:p-6 md:py-16 md:pl-8 md:pr-16 relative md:min-h-0">
            <img src="/trazabilidad.png" className="w-full h-full max-h-[26vh] md:max-h-[70vh] object-contain rounded-2xl" alt="Lanzamiento" />
          </div>
        </div>
      </section>

      {/* --- SECCIÓN MEMBRESÍA VIP --- */}
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <Link to="/membership" className="block group">
          <div className="bg-gradient-to-br from-amber-500/10 via-zinc-50/50 to-amber-500/5 dark:from-amber-500/15 dark:via-zinc-950/40 dark:to-transparent rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-amber-500/20 dark:border-amber-500/30 shadow-[0_24px_60px_rgba(245,158,11,0.02)] transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_24px_60px_rgba(245,158,11,0.12)]">
            {/* Columna Izquierda - Beneficios */}
            <div className="w-full md:w-[50%] p-6 py-8 md:py-16 md:pl-16 md:pr-8 flex flex-col justify-center order-2 md:order-1">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-600 dark:text-amber-400 mb-2 md:mb-3 block text-center md:text-left">
                MEMBRESÍA EXCLUSIVA
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white leading-tight text-center md:text-left">
                Únete al Club <span className="text-amber-500 font-extrabold">Intipa VIP</span>
              </h2>
              <div className="w-12 h-[2px] bg-amber-500/20 mb-6 mx-auto md:mx-0"></div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md text-sm md:text-base text-center md:text-left mx-auto md:mx-0 leading-relaxed font-light">
                Disfruta de beneficios diseñados para los amantes del estilo urbano. Descuento automático del 15% en tu carrito, envíos gratis a todo Chile sin montos mínimos y acceso prioritario a lanzamientos limitados.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-white/10">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                  <span className="text-lg font-bold text-amber-500">-15% OFF</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">En todas tus compras</span>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                  <span className="text-lg font-bold text-amber-500">Envío Gratis</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Sin mínimo de compra</span>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                  <span className="text-lg font-bold text-amber-500">Acceso VIP</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Drops exclusivos</span>
                </div>
              </div>
            </div>
            
            {/* Columna Derecha - Ilustración Tarjeta VIP */}
            <div className="w-full md:w-[50%] h-[30vh] min-h-[220px] md:h-auto order-1 md:order-2 bg-gradient-to-tr from-amber-500/5 to-amber-500/20 dark:from-zinc-950 dark:to-amber-500/10 flex items-center justify-center p-6 relative overflow-hidden">
              {/* Brillo degradado decorativo */}
              <div className="absolute w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -top-12 -right-12 animate-pulse"></div>
              
              {/* Tarjeta de Membresía VIP */}
              <div className="relative w-72 h-44 bg-zinc-900/90 dark:bg-[#0e1014]/90 rounded-2xl border border-amber-500/30 p-6 flex flex-col justify-between shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] tracking-widest text-amber-500 font-bold uppercase">Intipa Churin</p>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider mt-1">VIP MEMBER</h3>
                  </div>
                  {/* Icono Corona SVG */}
                  <svg className="w-8 h-8 text-amber-500 animate-pulse" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="15" cy="30" r="6" />
                    <circle cx="50" cy="13" r="6" />
                    <circle cx="85" cy="30" r="6" />
                    <path d="M 22 70 C 20 70, 16 65, 15 57 L 11 44 C 10 40, 14 38, 17 41 L 30 50 C 32 51, 35 50, 36 48 L 47 28 C 48 25, 52 25, 53 28 L 64 48 C 65 50, 68 51, 70 50 L 83 41 C 86 38, 90 40, 89 44 L 85 57 C 84 65, 80 70, 78 70 Z" />
                    <rect x="22" y="78" width="56" height="10" rx="5" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Suscripción Mensual</p>
                    <p className="text-sm font-bold text-white mt-0.5">$5.00 USD / mes</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 uppercase tracking-wider group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
                    Suscribirse
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* --- COMUNIDAD --- */}
      <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-left">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2 md:mb-3 block text-center md:text-left">COMUNIDAD</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-3 md:mb-4 text-center md:text-left">Lo que dice nuestra comunidad</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base max-w-xl mx-auto md:mx-0 text-center md:text-left">Miles de personas ya forman parte de Intipa Churin. Esto es lo que opinan sobre nuestra calidad y diseño.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={scrollTestimonialsLeft} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
            <button onClick={scrollTestimonialsRight} className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#2a2a2a] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
          </div>
        </div>

        <div className="overflow-hidden -my-8 py-8 -mx-6 px-6 md:-mx-12 md:px-12">
          <div
            ref={testiContainerRef}
            className={`flex w-full touch-pan-y transition-transform ease-[cubic-bezier(0.25,1,0.5,1)] ${isTestiDragging ? 'duration-0' : 'duration-700'} gap-6`}
            style={{ transform: `translateX(calc(-${testiIndex} * (100% + 1.5rem) / ${itemsPerView} + ${testiDragOffset}px))` }}
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
                  className={`snap-start carousel-card-item bg-white dark:bg-white/[0.02] backdrop-blur-md p-4 md:p-8 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden flex flex-col justify-between h-[220px] md:h-[260px] shrink-0 transition-all ${Object.keys(dynamicStyle).length > 0 ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${Object.keys(dynamicStyle).length === 0 ? opacityClass : ''}`}
                >
                  <div>
                    <div className="flex text-amber-500 dark:text-white mb-4 md:mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (<svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="mr-1 w-3 h-3 md:w-4 md:h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>))}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 text-xs md:text-base font-light leading-relaxed mb-6 md:mb-8 line-clamp-4">"{testimonial.text}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.img} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover grayscale opacity-80" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">{testimonial.author}</span>
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
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          <div className="col-span-2 md:col-span-1">
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
          <div className="col-span-1">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Ayuda</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Sobre la marca</Link></li>
              <li><Link to="/faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link to="/guide" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Guía de tallas</Link></li>
              <li><Link to="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Políticas</h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/shipping" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link to="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Términos de Servicio</Link></li>
              <li><Link to="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Aviso de Privacidad</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">Newsletter</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 transition-colors duration-300">Únete para recibir noticias sobre nuevos drops y ofertas exclusivas.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Tu correo electrónico" className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-all dark:text-white dark:placeholder-zinc-500" />
              <button className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm w-auto whitespace-nowrap">Suscribirme</button>
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