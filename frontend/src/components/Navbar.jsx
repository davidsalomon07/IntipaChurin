import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const Navbar = ({ backButton = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productosDB, setProductosDB] = useState([]);

  const { totalItems } = useCart();
  const { theme, setTheme } = useContext(ThemeContext);
  const { wishlist, hasNewNotifications } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProductosDB(data.filter(p => p.is_active));
        }
      } catch (error) {
        console.error("Error conectando con la base de datos:", error);
      }
    };
    cargarProductos();
  }, []);

  const normalizarTexto = (texto) => {
    if (!texto) return '';
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const resultadosBusqueda = searchQuery.trim() === '' ? [] : productosDB.filter((producto) => {
    const queryLimpiada = normalizarTexto(searchQuery);
    const palabrasEscritas = queryLimpiada.split(' ').filter(Boolean);
    const nombreLimpiado = normalizarTexto(producto.name);
    const categoriaLimpiada = normalizarTexto(producto.category_name || '');
    const textoBuscable = `${nombreLimpiado} ${categoriaLimpiada}`;

    // Usamos RegExp con \b (word boundary) para que busque solo al inicio de las palabras.
    // Así, si escribes "a", no coincidirá con la "a" que está dentro de "cargo" o "pantalón".
    return palabrasEscritas.every(palabra => {
      const regex = new RegExp(`\\b${palabra}`);
      return regex.test(textoBuscable);
    });
  });

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') cerrarBusqueda(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (searchOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [searchOpen, mobileMenuOpen]);

  const cerrarBusqueda = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleInicioClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      cerrarBusqueda();
    }
  };

  const handleProductoSugeridoClick = (termino) => {
    navigate(`/shop?search=${encodeURIComponent(termino)}`);
    cerrarBusqueda();
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex justify-between items-center relative">

          {/* ── LADO IZQUIERDO ── */}
          <div className="flex-1 flex items-center gap-4 md:gap-8">
            {backButton ? (
              <>
                <Link to="/" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  Volver
                </Link>
                {/* Botón de tema — solo en móvil */}
                <button
                  onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
                  className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
                  aria-label="Cambiar tema"
                >
                  {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
                </button>
              </>
            ) : (
              <>
                {/* Hamburguesa — solo en móvil */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  aria-label="Abrir menú"
                >
                  <MenuIcon />
                </button>

                {/* Botón de tema — solo en móvil */}
                <button
                  onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
                  className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
                  aria-label="Cambiar tema"
                >
                  {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
                </button>

                {/* Links desktop */}
                <div className="hidden md:flex gap-8 items-center font-medium">
                  <Link to="/" onClick={handleInicioClick} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Inicio</Link>
                  <div className="relative group py-8">
                    <span className="text-zinc-900 dark:text-zinc-100 cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors duration-300">
                      Colecciones
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                    <div className="absolute top-[60px] left-0 w-48 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Link to="/shop" className="block px-6 py-2 text-[12px] font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-100 dark:border-zinc-700 mb-1 pb-3">Catálogo Completo</Link>

                      {/* Generamos las categorías dinámicamente desde la BD */}
                      {Array.from(new Set(productosDB.map(p => p.category_name).filter(Boolean))).map((categoriaNombre, idx) => (
                        <Link
                          key={idx}
                          to={`/shop/${categoriaNombre.toLowerCase()}`}
                          className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors capitalize"
                        >
                          {categoriaNombre}
                        </Link>
                      ))}

                      {/* Mensaje por si aún no hay productos creados en la BD */}
                      {productosDB.length === 0 && (
                        <span className="block px-6 py-2 text-[11px] text-zinc-400 italic">Próximamente...</span>
                      )}
                    </div>
                  </div>
                  <Link to="/shop/nuevos" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Nuevos</Link>
                </div>
              </>
            )}
          </div>

          {/* ── LOGO CENTRADO ── */}
          <Link
            to="/"
            className="text-lg md:text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 dark:text-white transition-colors duration-300 hover:opacity-80"
          >
            Intipa Churin
          </Link>

          {/* ── LADO DERECHO ── */}
          <div className="flex gap-4 md:gap-6 text-zinc-600 dark:text-zinc-300 flex-1 justify-end items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>

            <button
              onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
              className="hidden md:block hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
              aria-label="Cambiar tema"
            >
              {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Perfil oculto en móvil */}
            <Link
              to={user ? (user.role_id === 1 ? "/admin" : "/profile") : "/login"}
              className="hidden md:block hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
            >
              <UserIcon />
            </Link>

            {/* BOTÓN DE WISHLIST */}
            <Link
              to="/wishlist"
              className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110 relative"
              aria-label="Lista de Deseos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {/* Notificador rojo si hay items y hay novedades */}
              {wishlist && wishlist.length > 0 && hasNewNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
              )}
            </Link>
            {/* FIN DEL BOTÓN DE WISHLIST */}

            <button
              onClick={() => setCartOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110 relative"
              aria-label="Carrito"
            >
              <CartIcon />
              <span className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors">
                {totalItems || 0}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer móvil */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* ── OVERLAY DE BÚSQUEDA ── */}
      <div
        className={`fixed inset-0 z-[100] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center pt-20 md:pt-32 overflow-y-auto transition-all duration-500 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <button
          onClick={cerrarBusqueda}
          className="absolute top-6 right-6 md:top-12 md:right-12 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-transform hover:rotate-90 duration-300"
        >
          <CloseIcon />
        </button>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl px-6 flex flex-col items-center">
          <div className="relative flex items-center w-full">
            <SearchIcon className="absolute left-0 w-8 h-8 text-zinc-400" />
            <input
              type="text"
              autoFocus={searchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: Pantalón verde, hoodie..."
              className="w-full bg-transparent text-lg md:text-3xl lg:text-5xl font-light text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700 border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-white outline-none py-4 md:py-6 pl-10 md:pl-16 transition-colors duration-300"
            />
          </div>

          <div className="w-full mt-12 mb-12">
            {searchQuery.trim() === '' ? (
              <p className="text-zinc-400 dark:text-zinc-600 text-center font-medium">Empieza a escribir para buscar en el inventario real.</p>
            ) : resultadosBusqueda.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up">
                {resultadosBusqueda.map((producto) => (
                  <div
                    key={producto.id}
                    onClick={() => handleProductoSugeridoClick(producto.name)}
                    className="group cursor-pointer flex flex-col items-start text-left"
                  >
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4 relative">
                      <img
                        src={producto.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=PRENDA`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={producto.name}
                      />
                      {producto.stock_quantity > 0 && producto.stock_quantity <= 5 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                          Últimos {producto.stock_quantity}
                        </span>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">{producto.category_name || 'General'}</span>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:underline underline-offset-4 decoration-2">{producto.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">${parseFloat(producto.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
                <p className="text-xl font-medium mb-2">No encontramos resultados para "{searchQuery}"</p>
                <p className="text-sm">Intenta buscar otro artículo del inventario de Intipa Churin.</p>
              </div>
            )}
          </div>
        </form>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;