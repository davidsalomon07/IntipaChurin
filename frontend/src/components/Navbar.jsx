import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;

const Navbar = ({ backButton = false }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      {/* Añadimos las clases dark:bg-zinc-900/90 y dark:border-zinc-800 */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 h-20 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex justify-between items-center relative">

          {/* Izquierda: Volver o links de navegación */}
          <div className="flex-1 flex items-center gap-8">
            {backButton ? (
              <Link to="/" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Volver
              </Link>
            ) : (
              <div className="hidden md:flex gap-8 items-center font-medium">
                <Link to="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Inicio</Link>
                <div className="relative group py-8">
                  <span className="text-zinc-900 dark:text-zinc-100 cursor-pointer uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors duration-300">
                    Colecciones
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                  <div className="absolute top-[60px] left-0 w-48 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Link to="/shop" className="block px-6 py-2 text-[12px] font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors border-b border-zinc-100 dark:border-zinc-700 mb-1 pb-3">Catálogo Completo</Link>
                    <Link to="/shop/hoodies" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Hoodies</Link>
                    <Link to="/shop/camisetas" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Camisetas</Link>
                    <Link to="/shop/pantalones" className="block px-6 py-2 text-[12px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors">Pantalones</Link>
                  </div>
                </div>
                <Link to="/shop/nuevos" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-wider text-[11px]">Nuevos</Link>
              </div>
            )}
          </div>

          {/* Centro: Logo */}
          <div className="text-xl font-bold tracking-widest uppercase absolute left-1/2 -translate-x-1/2 pointer-events-none dark:text-white transition-colors duration-300">
            Intipa Churin
          </div>

          {/* Derecha: Iconos */}
          <div className="flex gap-6 text-zinc-600 dark:text-zinc-300 flex-1 justify-end">
            <button className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"><SearchIcon /></button>
            <Link to="/profile" className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110"><UserIcon /></Link>
            <button onClick={() => setCartOpen(true)} className="hover:text-zinc-900 dark:hover:text-white transition-transform hover:scale-110 relative">
              <CartIcon />
              <span className="absolute -top-2 -right-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors">
                {totalItems || 0}
              </span>
            </button>
          </div>

        </div>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;