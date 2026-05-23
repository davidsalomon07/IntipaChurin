import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MobileMenu = ({ isOpen, onClose }) => {
  const [coleccionesOpen, setColeccionesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleLink = () => {
    onClose();
    setColeccionesOpen(false);
  };

  return (
    <>
      {/* ── Overlay oscuro detrás del drawer ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* ── Drawer lateral ── */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] z-[120] bg-white dark:bg-zinc-900
          border-r border-zinc-100 dark:border-zinc-800 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Cabecera del drawer */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Menú
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            aria-label="Cerrar menú"
          >
            {/* ✅ NUEVO: ícono X */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Buscador dentro del drawer */}
        <div className="px-6 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 text-zinc-400">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
                rounded-xl py-2.5 pl-9 pr-4 text-sm text-zinc-900 dark:text-white
                placeholder-zinc-400 dark:placeholder-zinc-500 outline-none
                focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
            />
          </form>
        </div>

        {/* Links de navegación */}
        <nav className="flex flex-col px-6 pt-4 gap-1 flex-1">
          <Link
            to="/"
            onClick={handleLink}
            className="py-3 text-[11px] font-bold uppercase tracking-widest
              text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white
              border-b border-zinc-100 dark:border-zinc-800 transition-colors"
          >
            Inicio
          </Link>

          {/* Colecciones con submenú */}
          <div className="border-b border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setColeccionesOpen(!coleccionesOpen)}
              className="w-full flex items-center justify-between py-3
                text-[11px] font-bold uppercase tracking-widest
                text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300
                transition-colors"
            >
              Colecciones
              {/* ✅ NUEVO: flecha que rota al abrir */}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${coleccionesOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Submenú de colecciones */}
            <div className={`overflow-hidden transition-all duration-200 ${coleccionesOpen ? 'max-h-48 pb-2' : 'max-h-0'}`}>
              <Link to="/shop" onClick={handleLink}
                className="block py-2 pl-4 text-[11px] font-bold text-zinc-700 dark:text-zinc-300
                  hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wider uppercase">
                Catálogo Completo
              </Link>
              <Link to="/shop/hoodies" onClick={handleLink}
                className="block py-2 pl-4 text-[11px] text-zinc-500 dark:text-zinc-400
                  hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wider uppercase">
                Hoodies
              </Link>
              <Link to="/shop/camisetas" onClick={handleLink}
                className="block py-2 pl-4 text-[11px] text-zinc-500 dark:text-zinc-400
                  hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wider uppercase">
                Camisetas
              </Link>
              <Link to="/shop/pantalones" onClick={handleLink}
                className="block py-2 pl-4 text-[11px] text-zinc-500 dark:text-zinc-400
                  hover:text-zinc-900 dark:hover:text-white transition-colors tracking-wider uppercase">
                Pantalones
              </Link>
            </div>
          </div>

          <Link
            to="/shop/nuevos"
            onClick={handleLink}
            className="py-3 text-[11px] font-bold uppercase tracking-widest
              text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white
              border-b border-zinc-100 dark:border-zinc-800 transition-colors"
          >
            Nuevos
          </Link>

          <Link
            to="/profile"
            onClick={handleLink}
            className="py-3 text-[11px] font-bold uppercase tracking-widest
              text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white
              border-b border-zinc-100 dark:border-zinc-800 transition-colors"
          >
            Mi Perfil
          </Link>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;