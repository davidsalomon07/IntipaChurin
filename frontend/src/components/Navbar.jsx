import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

// ── Íconos ──────────────────────────────────────────────────
const SearchIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const UserIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CartIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const CloseIcon   = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const MenuIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const SunIcon     = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon    = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const HeartIcon   = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const LogoutIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

const Navbar = ({ backButton = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [mobileMenuOpen,setMobileMenuOpen]= useState(false);
  const [productosDB,   setProductosDB]   = useState([]);

  // [CAMBIO] Estado del menú de cuenta (reemplaza los 3 iconos sueltos)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { totalItems, cartOpen, setCartOpen } = useCart();
  const { theme, setTheme }              = useContext(ThemeContext);
  const { wishlist, hasNewNotifications } = useWishlist();
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        if (res.ok) {
          const data = await res.json();
          setProductosDB(data.filter(p => p.is_active));
        }
      } catch (e) { console.error(e); }
    };
    cargarProductos();
  }, []);

  // [CAMBIO] Cierra el menú de cuenta al hacer click fuera
  useEffect(() => {
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const normalizarTexto = (t) =>
    t ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

  const resultadosBusqueda = searchQuery.trim() === '' ? [] :
    productosDB.filter((p) => {
      const q = normalizarTexto(searchQuery);
      const palabras = q.split(' ').filter(Boolean);
      const texto = `${normalizarTexto(p.name)} ${normalizarTexto(p.category_name || '')}`;
      return palabras.every(w => new RegExp(`\\b${w}`).test(texto));
    });

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') cerrarBusqueda(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (searchOpen || mobileMenuOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [searchOpen, mobileMenuOpen]);

  const cerrarBusqueda = () => { setSearchOpen(false); setSearchQuery(''); };

  const handleInicioClick = (e) => {
    if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); cerrarBusqueda(); }
  };

  const handleProductoClick = (nombre) => {
    navigate(`/shop?search=${encodeURIComponent(nombre)}`);
    cerrarBusqueda();
  };

  // [CAMBIO] Logout desde el dropdown
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserMenuOpen(false);
    navigate('/login');
  };

  const toggleTheme = () => setTheme(theme === 'Dark' ? 'Light' : 'Dark');

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex justify-between items-center relative">

          {/* ── LADO IZQUIERDO ── */}
          <div className="flex-1 flex items-center gap-4 md:gap-8">
            {backButton ? (
              <Link
                to="/"
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Volver
              </Link>
            ) : (
              <>
                {/* Hamburguesa móvil */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  aria-label="Abrir menú"
                >
                  <MenuIcon />
                </button>

                {/* Links desktop */}
                <div className="hidden md:flex gap-8 items-center font-medium">
                  <Link
                    to="/"
                    onClick={handleInicioClick}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                  >
                    Inicio
                  </Link>

                  {/* Dropdown Colecciones */}
                  <div className="relative group py-8">
                    <span className="text-zinc-900 dark:text-zinc-100 cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors duration-300">
                      Colecciones
                      <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                    <div className="absolute top-[60px] left-0 w-52 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Link to="/shop" className="block px-5 py-2.5 text-[12px] font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-1">
                        Catálogo Completo
                      </Link>
                      {Array.from(new Set(productosDB.map(p => p.category_name).filter(Boolean))).map((cat, i) => (
                        <Link key={i} to={`/shop/${cat.toLowerCase()}`} className="block px-5 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors capitalize">
                          {cat}
                        </Link>
                      ))}
                      {productosDB.length === 0 && (
                        <span className="block px-5 py-2 text-[11px] text-zinc-400 italic">Próximamente...</span>
                      )}
                    </div>
                  </div>

                  <Link to="/shop/nuevos" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Nuevos</Link>
                  <Link to="/about" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Sobre nosotros</Link>
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

          {/* ── LADO DERECHO — solo 3 iconos ── */}
          {/* [CAMBIO] De 5 iconos (lupa+sol+usuario+corazón+carrito) a 3 (lupa+cuenta+carrito) */}
          <div className="flex gap-5 md:gap-6 text-zinc-600 dark:text-zinc-300 flex-1 justify-end items-center">

            {/* Búsqueda */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>

            {/* ── MENÚ DE CUENTA (desktop) ── */}
            {/* [CAMBIO] Un solo ícono reemplaza: usuario + corazón + sol/luna */}
            <div className="hidden md:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="relative hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"
                aria-label="Mi cuenta"
              >
                {user?.is_vip && (
                  <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 select-none pointer-events-none z-20 animate-pulse text-amber-500 dark:text-amber-400">
                    <svg className="w-4 h-4 drop-shadow-[0_1.5px_2px_rgba(245,158,11,0.5)]" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="15" cy="30" r="6" />
                      <circle cx="50" cy="13" r="6" />
                      <circle cx="85" cy="30" r="6" />
                      <path d="M 22 70 C 20 70, 16 65, 15 57 L 11 44 C 10 40, 14 38, 17 41 L 30 50 C 32 51, 35 50, 36 48 L 47 28 C 48 25, 52 25, 53 28 L 64 48 C 65 50, 68 51, 70 50 L 83 41 C 86 38, 90 40, 89 44 L 85 57 C 84 65, 80 70, 78 70 Z" />
                      <rect x="22" y="78" width="56" height="10" rx="5" />
                    </svg>
                  </span>
                )}
                {user ? (
                  // Si está logueado → muestra inicial del nombre
                  <div className={`w-7 h-7 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-[11px] font-bold uppercase leading-none select-none transition-all duration-300 ${user.is_vip ? 'ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-zinc-950 scale-105' : ''}`}>
                    <span className="flex items-center justify-center h-full w-full">{user.first_name?.charAt(0) || 'U'}</span>
                  </div>
                ) : (
                  <UserIcon />
                )}
                {/* Punto rojo si hay novedades en wishlist */}
                {wishlist?.length > 0 && hasNewNotifications && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950" />
                )}
              </button>

              {/* Dropdown de cuenta */}
              <div className={`
                absolute top-full right-0 mt-4 w-64
                bg-white dark:bg-zinc-900
                border border-zinc-100 dark:border-zinc-800
                rounded-2xl shadow-2xl shadow-black/10
                overflow-hidden z-50
                transition-all duration-200 origin-top-right
                ${userMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
              `}>
                {user ? (
                  <>
                    {/* Cabecera con info del usuario */}
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 text-sm font-bold uppercase shrink-0 leading-none select-none">
                        <span className="flex items-center justify-center h-full w-full">{user.first_name?.charAt(0) || 'U'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                            {user.first_name} {user.last_name}
                          </p>
                          {user.is_vip && (
                            <span className="text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 select-none">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    {/* Links principales */}
                    <div className="py-2">
                      <Link
                        to={user.role_id === 1 ? "/admin" : "/profile"}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <ProfileIcon />
                        Mi Perfil
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <HeartIcon />
                        Lista de Deseos
                        {wishlist?.length > 0 && (
                          <span className="ml-auto text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Tema */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 py-2">
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full px-5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
                          {theme === 'Dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        </span>
                        {/* Pill indicador */}
                        <span className={`w-8 h-4 rounded-full transition-colors duration-300 ${theme === 'Dark' ? 'bg-zinc-700' : 'bg-zinc-200'} relative`}>
                          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm ${theme === 'Dark' ? 'left-4' : 'left-0.5'}`} />
                        </span>
                      </button>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        <LogoutIcon />
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  // No logueado → mostrar opciones de acceso
                  <div className="p-4 flex flex-col gap-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-1">
                      Accede para ver tus pedidos y favoritos
                    </p>
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-center py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setUserMenuOpen(false)}
                      className="border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-center py-3 rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Crear cuenta
                    </Link>
                    {/* Toggle de tema incluso sin login */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-3">
                      <button
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full text-sm text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="flex items-center gap-2">
                          {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
                          {theme === 'Dark' ? 'Modo claro' : 'Modo oscuro'}
                        </span>
                        <span className={`w-8 h-4 rounded-full transition-colors duration-300 ${theme === 'Dark' ? 'bg-zinc-700' : 'bg-zinc-200'} relative`}>
                          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 shadow-sm ${theme === 'Dark' ? 'left-4' : 'left-0.5'}`} />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110 relative"
              aria-label="Carrito"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer móvil — recibe theme para el toggle interno */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        wishlistCount={wishlist?.length || 0}
      />

      {/* ── OVERLAY DE BÚSQUEDA (sin cambios) ── */}
      <div className={`fixed inset-0 z-[100] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center pt-20 md:pt-32 overflow-y-auto transition-all duration-500 ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <button
          onClick={cerrarBusqueda}
          className="absolute top-6 right-6 md:top-12 md:right-12 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-transform hover:rotate-90 duration-300"
        >
          <CloseIcon />
        </button>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl px-6 flex flex-col items-center">
          <div className="relative flex items-center w-full">
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
              <p className="text-zinc-400 dark:text-zinc-600 text-center font-medium">Empieza a escribir para buscar productos.</p>
            ) : resultadosBusqueda.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {resultadosBusqueda.map((p) => (
                  <div key={p.id} onClick={() => handleProductoClick(p.name)} className="group cursor-pointer flex flex-col items-start text-left">
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4 relative">
                      <img src={p.image_url || 'https://placehold.co/600x800/f5f5f4/d6d3d1?text=PRENDA'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.name} />
                      {p.stock_quantity > 0 && p.stock_quantity <= 5 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">Últimos {p.stock_quantity}</span>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">{p.category_name || 'General'}</span>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:underline underline-offset-4 decoration-2">{p.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">${parseFloat(p.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
                <p className="text-xl font-medium mb-2">Sin resultados para "{searchQuery}"</p>
                <p className="text-sm">Intenta con otro término.</p>
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