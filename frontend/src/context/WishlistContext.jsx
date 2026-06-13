import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto
const WishlistContext = createContext();

// 2. Hook personalizado para usarlo fácilmente en cualquier componente
export const useWishlist = () => useContext(WishlistContext);

// 3. El Proveedor que envolverá nuestra App
export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [hasNewNotifications, setHasNewNotifications] = useState(() => {
        return localStorage.getItem('wishlist_has_new') === 'true';
    });

    // Cargar la wishlist desde el backend
    const loadWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setWishlist([]);
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (error) {
            console.error("Error al cargar wishlist:", error);
        }
    };

    // Escuchamos cambios en el token del localStorage (por ejemplo al iniciar sesión)
    useEffect(() => {
        loadWishlist();
        
        // Listener para detectar cuando se inicia sesión en la misma pestaña
        const handleStorageChange = () => {
            loadWishlist();
        };

        window.addEventListener('storage', handleStorageChange);
        // También podemos escuchar un evento personalizado o chequear periódicamente
        const interval = setInterval(loadWishlist, 2000); // Check every 2 seconds to keep it sync

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Verificar si un producto ya está en la lista
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    // Limpiar notificaciones (marcar como leídas)
    const clearNotifications = () => {
        setHasNewNotifications(false);
        localStorage.setItem('wishlist_has_new', 'false');
    };

    // Agregar o quitar producto dinámicamente
    const toggleWishlist = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            return;
        }

        const isSaved = isInWishlist(product.id);

        // Optimistic UI: Actualizamos el estado visualmente al instante para que no haya lag
        if (isSaved) {
            setWishlist(prev => prev.filter(item => item.id !== product.id));
            // Petición real al backend para eliminar
            try {
                await fetch(`http://localhost:3000/api/wishlist/${product.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Error al eliminar de la wishlist:", error);
                // Revertir en caso de error
                loadWishlist();
            }
        } else {
            setWishlist(prev => [...prev, product]);
            setHasNewNotifications(true);
            localStorage.setItem('wishlist_has_new', 'true');
            // Petición real al backend para agregar
            try {
                await fetch('http://localhost:3000/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ product_id: product.id })
                });
            } catch (error) {
                console.error("Error al agregar a la wishlist:", error);
                // Revertir en caso de error
                loadWishlist();
            }
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadWishlist, hasNewNotifications, clearNotifications }}>
            {children}
        </WishlistContext.Provider>
    );
};