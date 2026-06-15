import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast'; // Importado

const Wishlist = () => {
    const { wishlist, toggleWishlist, clearNotifications } = useWishlist();
    const { agregarAlCarrito } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (clearNotifications) {
            clearNotifications();
        }
    }, [clearNotifications]);

    return (
        <div className="bg-[#FCFCFC] dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-[80vh]">
                <div className="mb-10 flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">Lista de Deseos</h1>
                    <span className="text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        {wishlist.length} {wishlist.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-zinc-400 dark:text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2 dark:text-white">Tu lista está vacía</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
                            Aún no has guardado ningún artículo. Explora nuestra colección y añade tus favoritos.
                        </p>
                        <Link
                            to="/shop"
                            className="bg-zinc-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-zinc-800 hover:scale-105 transition-all dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
                        >
                            Explorar Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {wishlist.map((producto) => (
                            <div key={producto.id} className="group cursor-pointer flex flex-col" onClick={() => navigate(`/shop/producto/${producto.id}`)}>
                                <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3 relative transition-colors duration-300 shadow-sm border border-zinc-100 dark:border-zinc-800/50">
                                    <img
                                        src={producto.image_url || `https://placehold.co/600x800/f5f5f4/d6d3d1?text=SIN+FOTO`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 dark:opacity-80"
                                        alt={producto.name}
                                    />

                                    {/* Botón para Eliminar de Wishlist */}
                                    <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(producto);
                                            }}
                                            title="Quitar de favoritos"
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-500 transition-all duration-300 hover:scale-110 dark:bg-zinc-900/90 dark:hover:bg-red-500/20"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{producto.name}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-4">$ {parseFloat(producto.price).toFixed(2)}</p>

                                {/* Botón Añadir al Carrito rápido */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        agregarAlCarrito({
                                            id: producto.id,
                                            nombre: producto.name,
                                            precio: parseFloat(producto.price),
                                            categoria: producto.category_name || 'General',
                                            imagen: producto.image_url,
                                            stock_quantity: producto.stock_quantity
                                        });
                                    }}
                                    className="mt-auto w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-zinc-900"
                                >
                                    Añadir al Carrito
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* MiniFooter transparente */}
            <footer className="pt-10 pb-10 px-6 md:px-12 border-t border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Copyright */}
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium text-center md:text-left transition-colors duration-300">
                        © 2026 Intipa Churin. Todos los derechos reservados.
                    </p>

                    {/* Enlaces de Redes Sociales, conservando el espaciado para WhatsApp en desktop */}
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

export default Wishlist;