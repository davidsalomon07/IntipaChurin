import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext"; // <-- 1. Importamos el carrito

// Íconos SVG
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const Home = () => {
  const navigate = useNavigate(); // <-- Iniciamos el navegador
  const { agregarAlCarrito } = useCart();
  
  // Estado extra para forzar renderizado si cambia el tamaño de pantalla
  const [itemsPerView, setItemsPerView] = React.useState(typeof window !== 'undefined' && window.innerWidth >= 768 ? 4 : 3);

  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 4 : 3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // --- NUEVOS ESTADOS PARA PRODUCTOS Y CATEGORÍAS REALES ---
  const [productosDestacados, setProductosDestacados] = React.useState([]);
  const [categoriasDB, setCategoriasDB] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [catIndex, setCatIndex] = React.useState(0); // <-- Controla qué categorías se ven

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos ambas peticiones al mismo tiempo para que cargue más rápido
        const [resProductos, resCategorias] = await Promise.all([
          fetch('http://localhost:3000/api/products'),
          fetch('http://localhost:3000/api/categories')
        ]);

        if (resProductos.ok) {
          const dataProductos = await resProductos.json();
          // Tomamos solo los 4 primeros productos para el Home
          setProductosDestacados(dataProductos.slice(0, 4));
        }

        if (resCategorias.ok) {
          const dataCategorias = await resCategorias.json();
          // Ahora guardamos TODAS las categorías para poder navegar entre ellas
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
  // ---------------------------------------------

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300 relative">
      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-28 pb-12 px-6 md:px-12 max-w-400 mx-auto">
        <div className="relative w-full h-[75vh] md:h-[85vh] rounded-3xl overflow-hidden group shadow-sm">
          <img
            src="https://placehold.co/1920x1080/e7e5e4/a8a29e?text=MODELOS+DIVERSOS+UNISEX"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105"
            alt="Nueva Colección"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/40 transition-colors duration-300"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase mb-4 drop-shadow-md">
              Colección Esencial 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-lg">
              Define tu estilo.
            </h1>
            <p className="text-base md:text-lg font-light mb-10 max-w-lg drop-shadow-md">
              Siluetas modernas y versátiles. Diseñadas sin distinciones de
              género para una comodidad absoluta y expresión libre.
            </p>
            <Link
              to="/shop"
              className="bg-white text-zinc-900 px-8 py-4 rounded-full text-sm font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-700 dark:hover:bg-white dark:hover:text-zinc-900"
            >
              Explorar Colección
            </Link>
          </div>
        </div>
      </section>

      {/* --- CATEGORÍAS (CON ANIMACIÓN DE CARRUSEL) --- */}
      <section className="py-20 px-6 md:px-12 max-w-400 mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-white text-center md:text-left">
            Comprar por Categoría
          </h2>
          
          {/* Controles tipo Carrusel */}
          {categoriasDB.length > itemsPerView && (
            <div className="flex gap-3">
              <button 
                onClick={() => setCatIndex(prev => Math.max(0, prev - 1))}
                disabled={catIndex === 0}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${catIndex === 0 ? 'border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700 cursor-not-allowed' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:scale-105 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800 shadow-sm'}`}
                aria-label="Categoría anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button 
                onClick={() => {
                  const limite = categoriasDB.length - itemsPerView;
                  setCatIndex(prev => Math.min(Math.max(0, limite), prev + 1));
                }}
                disabled={catIndex >= Math.max(0, categoriasDB.length - itemsPerView)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${catIndex >= Math.max(0, categoriasDB.length - itemsPerView) ? 'border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700 cursor-not-allowed' : 'border-zinc-300 text-zinc-900 hover:bg-zinc-100 hover:scale-105 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800 shadow-sm'}`}
                aria-label="Siguiente categoría"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          )}
        </div>

        {/* CONTENEDOR DEL SLIDER - REPARADO */}
        <div className="overflow-hidden -mx-2 md:-mx-5">
          {categoriasDB.length === 0 ? (
            <div className="text-center text-zinc-500 py-10 w-full">
              <p>Estamos preparando las colecciones para ti. ¡Vuelve pronto!</p>
            </div>
          ) : (
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${catIndex * (100 / itemsPerView)}%)` }}
            >
              {categoriasDB.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="flex-shrink-0 px-2 md:px-5"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <Link
                      to={`/shop/${cat.name.toLowerCase()}`}
                      className="group cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-2 md:mb-6 relative shadow-sm transition-colors duration-300">
                        <img
                          src={`https://placehold.co/600x800/f5f5f4/d6d3d1?text=${cat.name.toUpperCase()}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-95 dark:opacity-80"
                          alt={cat.name}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-colors duration-500"></div>
                      </div>
                      <h3 className="text-[11px] md:text-sm font-semibold uppercase tracking-wider dark:text-zinc-200 text-center leading-tight">
                        {cat.name}
                      </h3>
                    </Link>
                  </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- PRODUCTOS DESTACADOS --- */}
      <section className="py-20 px-6 md:px-12 max-w-400 mx-auto border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-white">
            Selección Inicial
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border-b border-transparent hover:border-zinc-900 dark:hover:border-white transition-all pb-1"
          >
            Ver catálogo
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-8">
          {isLoading ? (
            <div className="col-span-full py-12 flex justify-center text-zinc-400">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : productosDestacados.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
              <p>Próximamente nuevos ingresos. ¡Mantente atento!</p>
            </div>
          ) : (
            productosDestacados.map((producto) => (
              <div 
                key={producto.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/shop/producto/${producto.id}`)}
              >
                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-2 md:mb-5 relative transition-colors duration-300">
                  <img
                    // Si no tiene imagen en la base de datos, ponemos una por defecto
                    src={producto.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=SIN+FOTO`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 dark:opacity-80"
                    alt={producto.name}
                  />

                  <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:group-hover:translate-y-0 md:translate-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Adaptamos los nombres de la BD al contexto de tu carrito
                        agregarAlCarrito({
                          id: producto.id,
                          nombre: producto.name,
                          precio: parseFloat(producto.price),
                          categoria: producto.category_name,
                          imagen: producto.image_url
                        }); 
                      }}
                      title="Añadir al carrito"
                      className="w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-2xl border transform transition-all duration-150 active:scale-90 active:shadow-md bg-zinc-950 text-white hover:bg-zinc-800 border-transparent dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-[11px] md:text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-0.5 md:mb-1 transition-colors duration-300 truncate leading-tight">
                  {producto.name}
                </h3>
                <p className="text-[11px] md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold transition-colors duration-300">
                  $ {parseFloat(producto.price).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- NUEVA COLECCIÓN / DROP (Lookbook) --- */}
      <section className="py-20 px-6 md:px-12 max-w-400 mx-auto">
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-4xl overflow-hidden flex flex-col md:flex-row items-center transition-colors duration-300 dark:border dark:border-zinc-800">
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400 mb-4 transition-colors duration-300">
              Lanzamiento Exclusivo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight dark:text-white transition-colors duration-300">
              Trazabilidad <br /> & Minimalismo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed max-w-md transition-colors duration-300">
              Descubre nuestra primera línea de prendas estructuradas. Diseñadas
              en Quito, pensadas para adaptarse a cualquier estilo de vida sin
              perder la esencia.
            </p>
            <div>
              <Link
                to="/lookbook"
                className="border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all duration-300 inline-block"
              >
                Ver Lookbook
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-full min-h-125 relative">
            <img
              src="https://placehold.co/1000x1200/e7e5e4/a8a29e?text=IMAGEN+EDITORIAL"
              className="absolute inset-0 w-full h-full object-cover opacity-95 dark:opacity-80"
              alt="Lookbook"
            />
          </div>
        </div>
      </section>

      {/* --- BENEFICIOS --- */}
      <section className="py-24 px-6 md:px-12 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-400 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h3 className="text-base font-bold mb-2 dark:text-white transition-colors duration-300">
              Envío Gratis
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs transition-colors duration-300">
              En todas las órdenes a nivel nacional superiores a $100.
            </p>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
            <h3 className="text-base font-bold mb-2 dark:text-white transition-colors duration-300">
              Devoluciones Fáciles
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs transition-colors duration-300">
              Tienes 30 días para realizar cambios o devoluciones sin costo.
            </p>
          </div>

          <div className="flex flex-col items-center pt-8 md:pt-0">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-base font-bold mb-2 dark:text-white transition-colors duration-300">
              Pago 100% Seguro
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs transition-colors duration-300">
              Procesamos tus pagos con los más altos estándares de seguridad.
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="py-24 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-900/30 transition-colors duration-300 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-400 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-16 tracking-tight dark:text-white transition-colors duration-300">
            Lo que dice nuestra comunidad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "La calidad de las telas es increíble. Por fin una marca que entiende que el buen diseño no tiene género.",
                author: "Andrea V.",
              },
              {
                text: "El calce de los pantalones es perfecto. La experiencia de compra y el empaque se sienten totalmente premium.",
                author: "Mateo R.",
              },
              {
                text: "Piezas minimalistas que combinan con todo. Definitivamente mis nuevos básicos para el día a día.",
                author: "Sofía C.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left dark:border dark:border-zinc-800 duration-300"
              >
                <div className="flex text-zinc-800 dark:text-zinc-200 mb-4 transition-colors duration-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 transition-colors duration-300">
                  "{testimonial.text}"
                </p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white transition-colors duration-300">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white dark:bg-zinc-950 pt-20 pb-10 px-6 md:px-12 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-400 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="text-xl font-bold tracking-widest uppercase mb-6 dark:text-white transition-colors duration-300">
              Intipa Churin
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed transition-colors duration-300">
              Moda contemporánea, inclusiva y transparente. Diseñada para
              trascender temporadas.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">
              Enlaces
            </h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link
                  to="/about"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Sobre la marca
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">
              Políticas
            </h4>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Aviso de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wider dark:text-white transition-colors duration-300">
              Newsletter
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 transition-colors duration-300">
              Únete para recibir noticias sobre nuevos drops y ofertas
              exclusivas.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-all dark:text-white dark:placeholder-zinc-500"
              />
              <button className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                Unirme
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-400 mx-auto border-t border-zinc-100 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium transition-colors duration-300">
            © 2026 Intipa Churin. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 pr-20 md:pr-24">
            <a
              href="https://instagram.com/tu_usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@tu_usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
            >
              Tiktok
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;